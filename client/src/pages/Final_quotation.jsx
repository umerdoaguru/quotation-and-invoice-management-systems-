import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import UpdateServicesForm from "./UpdateServicesForm";
import UpdateHeaderImageForm from "./UpdateHeaderImageForm";
import UpdateFooterImageForm from "./UpdatFooterImageForm";
import Footer from "./Footer";
import UserLogin from "./UserLogin";
import Logout from "./Logout";

function Final_quotation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quotations, setQuotations] = useState([]);
  const [quotationName, setQuotationName] = useState("");
  const [quotationServiceDescription, setQuotationServiceDescription] =
    useState("");
  const [totalActualPrice, setTotalActualPrice] = useState(0);
  const [totalOfferPrice, setTotalOfferPrice] = useState(0);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [notes, setNotes] = useState([]);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `https://quotation.queuemanagementsystemdg.com/api/quotation/${id}`
      );

      if (response.status === 200) {
        setQuotationName(response.data[0].quotation_name);
        setQuotations(response.data);

        const actualPriceTotal = response.data.reduce(
          (total, q) => total + q.actual_price,
          0
        );
        const offerPriceTotal = response.data.reduce(
          (total, q) => total + q.offer_price,
          0
        );

        setTotalActualPrice(actualPriceTotal);
        setTotalOfferPrice(offerPriceTotal);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/notes/${id}`);

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handlePrintPage = () => {
    navigate(`/print/${id}`);
  };

  const handleUpdateSuccess = () => {
    console.log("Services updated successfully");
    setIsUpdateMode(false);
    window.location.reload();
  };

  const handleUpdateError = () => {
    console.error("Error updating services");
    // Handle error, e.g., show an error message or update state
  };

  const handleAddNotes = () => {
    navigate(`/createnotes/${id}`);
  };

  const handleDeleteNotes = () => {
    navigate(`/deletenotes/${id}`);
  };
  const handleUpdateNotes = () => {
    navigate(`/update-notes/${id}`);
  };

  const handleAddServices = () => {
    navigate(`/addservices/${id}`);
  };
  const handleDeleteService = async (serviceId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this row data?"
    );

    if (isConfirmed) {
      try {
        // Make an API call to delete the service
        const response = await axios.delete(
          `https://quotation.queuemanagementsystemdg.com/api/services/${serviceId}`
        );

        if (response.status === 200) {
          console.log("Service deleted successfully");
          // You can perform additional actions after successful deletion
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  useEffect(() => {
    fetchQuotations();
    fetchNotes();
  }, []);

  const filterServicesByType = (type) => {
    return quotations.filter((q) => q.service_type === type);
  };
  const handleReview = () => {
    navigate(`/review/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Wrapper>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4   mt-3">
              <div className="mx-lg-4">
                <UserLogin />
              </div>
            </div>
            <div className="col-lg-4  mt-3">
              <h5 className=" text-lg-center">
                Quotation Name:-{quotationName}
              </h5>
            </div>
            <div className="col-lg-4 mt-3">
              <div className=" float-lg-end  mx-lg-2">
                {" "}
                <Logout />
              </div>
            </div>
          </div>

          <div className="container-fluid mt-4">
            <div className="row g-2">
              <div className="col-lg-3">
                {" "}
                <Link
                  to="/quotation-form"
                  className="text-white btn btn-success  mx-1  w-100"
                >
                  {" "}
                  <i className="bi bi-arrow-return-left mx-1"></i>Back
                </Link>
              </div>
              <div className="col-lg-3">
                {" "}
                <button
                  className="btn btn-success mx-1  w-100"
                  onClick={() => setIsUpdateMode(true)}
                >
                  Update Services
                </button>{" "}
              </div>
              {isUpdateMode && (
                <UpdateServicesForm
                  quotationId={id}
                  onUpdateSuccess={handleUpdateSuccess}
                  onUpdateError={handleUpdateError}
                />
              )}
              <div className="col-lg-3">
                {" "}
                <button
                  className="btn  btn-success mx-1  w-100"
                  onClick={handleAddServices}
                >
                  Add Services
                </button>
              </div>
              <div className="col-lg-3">
                <Link
                  to="/quotationlist"
                  className="text-white text-decoration-none btn btn-success mx-1  w-100"
                >
                  Quotation List
                </Link>
              </div>{" "}
            </div>
          </div>

          <div className="container-fluid">
            <div className="container-fluid mt-3">
              <h4>Paid Services</h4>
              <div
                className=""
                style={{ maxHeight: "700px", overflowY: "auto" }}
              >
                <table className="table table-bordered ">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Service Name</th>
                      <th>Service Description</th>
                      <th>Actual Price(INR)</th>
                      <th>Offer Price(INR)</th>
                      <th>Subscription</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterServicesByType("Paid").map((q, index) => (
                      <tr key={q.id}>
                        <td
                          className="text-center"
                          style={{ fontSize: "1rem", fontWeight: "bold" }}
                        >
                          {index + 1}
                        </td>
                        <td style={{ fontSize: "1rem", fontWeight: "bold" }}>
                          {q.service_name}
                        </td>
                        <td style={{ whiteSpace: "pre-line" }}>
                      
                          {q.service_description
                            // .split(".")
                            // .map((part, index) => (
                            //   <p key={index}>
                            //     {part.trim()}
                            //     {index !==
                            //       q.service_description.split(".").length - 1 &&
                            //       "."
                            //       }
                            //   </p>
                            // ))
                            }
                        </td>
                        <td className="th">{q.actual_price}</td>
                        <td className="th">{q.offer_price}</td>
                        <td className="th"> {q.subscription_frequency}</td>

                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteService(q.service_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Complimentary Services */}
            <div className="container-fluid mt-3">
              <h4>Complimentary Services</h4>
              <div
                className=""
                style={{ maxHeight: "700px", overflowY: "auto" }}
              >
                <table className="table table-bordered ">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Service Name</th>
                      <th>Service Description</th>
                      <th>Actual Price(INR)</th>
                      <th>Offer Price(INR)</th>
                      <th>Subscription</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterServicesByType("Complimentary").map((q, index) => (
                      <tr key={q.id}>
                        <td
                          className="text-center"
                          style={{ fontSize: "1rem", fontWeight: "bold" }}
                        >
                          {index + 1}
                        </td>
                        <td style={{ fontSize: "1rem", fontWeight: "bold" }}>
                          {q.service_name}
                        </td>
                        <td style={{ whiteSpace: "pre-line" }}>
                          {q.service_description}
                        </td>
                        <td className="th">{q.actual_price}</td>
                        <td className="th">{q.offer_price}</td>
                        <td className="th"> {q.subscription_frequency}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteService(q.service_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* <button className="btn btn-outline-danger" onClick={handleDelete}>
              Delete
            </button> */}

            <div className="note mt-3">
              <h5 className=" fw-bold">Notes:-</h5>

              <ul>
                {notes.map((note) => (
                  <li key={note.id} style={{ whiteSpace: "pre-line" }}>
                    {note.note_text}
                    <p>{note.additional_info}</p>
                  </li>
                ))}
              {/* <li>The payment is Non-Refundable.
              </li> */}
              </ul>
            </div>
          </div>

          <div className="container-fluid">
            <div className="">
              {" "}
              <button
                className="btn btn-primary mx-1  "
                onClick={handleAddNotes}
              >
                Add Notes
              </button>{" "}
              <button
                className="btn btn-danger mx-1 "
                onClick={handleDeleteNotes}
              >
                Delete Notes
              </button>
              <button
                className="btn btn-info mx-1  text-white"
                onClick={handleUpdateNotes}
              >
                Edit Notes
              </button>
              <div className="col-lg-6">
                {" "}
                <button
                  className="btn btn-success mt-1 mb-2 "
                  onClick={handleReview}
                >
                  Review Quotation data
                </button>
              </div>
              <div className="col-lg-6"></div>
              <div className="col-lg-12">
                <button
                  className="btn btn-success p-3 w-75 mb-2 w-100"
                  onClick={handlePrintPage}
                >
                  Print_Page
                </button>
              </div>
            </div>
          </div>
          <div className="container-fluid"></div>
        </div>
        {/* <div className="container-fluid">
        <div className="mt-3 mb-3">
          {isUpdateFooterMode ? (
            <UpdateFooterImageForm
              quotationId={id}
              onBack={() => setIsUpdateHeaderMode(false)}
            />
          ) : (
            <>
              <div className="mt-3 mb-3">
                <img
                  src={footerImagePath}
                  alt="footer not found"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
              <button
                className="btn btn-primary mx-2"
                onClick={handleAddFooterImage}
              >
                Add Footer Image
              </button>

              <button
                className="btn btn-primary mx-2"
                onClick={() => setIsUpdateFooterMode(true)}
              >
                Update Footer Image
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={handleDeleteFooterImage}
              >
                Delete Footer Image
              </button>
            </>
          )}
        </div>
        </div> */}
      </Wrapper>

      {/* <button className="btn btn-success mt-2  mb-3" onClick={handleChangeHeaderFooter}>

           
             Change Footer
         
          </button> */}
    </>
  );
}

export default Final_quotation;

const Wrapper = styled.div`
  th {
    font-weight: bold;
    font-size: 1.2rem;
  }
  .table {
    border: black;
  }
  .th {
    font-weight: bold;
    font-size: 1.2rem;
  }
  li {
    font-weight: bold;
    font-size: 1rem;
  }
`;
