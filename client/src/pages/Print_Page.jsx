import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import moment from "moment";
import Header from "./Header";
import Footer from "./Footer";
import Frontendpage from "./Frontendpage";
import Services from "./Services";
import OurClient from "./OurClient";
import Lastpage from "./Lastpage";
import EditableSeoPayment from "./EditableSeoPayment";
import EditablePaymentTable from "./EditablePaymentWebTable";
import { useSelector } from "react-redux";
import UserLogin from "./UserLogin";
import Logout from "./Logout";

function Print_Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [quotationDate, setQuotationDate] = useState(""); // New state to store quotation name
  const [quotationName, setQuotationName] = useState("");
  const [companyNames, setCompanyNames] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [accountname, setAccountName] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const [isCompanySelected, setIsCompanySelected] = useState(false); // Track if a company is selected

  const [notes, setNotes] = useState([]);
  const [footerImagePath, setFooterImagePath] = useState("");

  const [headerImagePath, setHeaderImagePath] = useState("");

  const UserId = useSelector((state) => state.auth.user.id);
  const [rowVisible, setRowVisible] = useState(true);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `https://quotation.queuemanagementsystemdg.com/api/quotation/${id}`
      );

      if (response.status === 200) {
        setQuotationDate(response.data[0].created_date); // Set the quotation name
        setQuotationName(response.data[0].quotation_name);
        setQuotations(response.data);
        console.log(response);
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


  useEffect(() => {
    // Fetch company names from the backend
    const fetchCompanyNames = async () => {
      try {
        const response = await axios.get(
          `https://quotation.queuemanagementsystemdg.com/api/header-footer-images/company-names/${UserId}`
        );
        if (response.status === 200) {
          setCompanyNames(response.data); // Assuming response.data is an array of company names
        } else {
          console.error("Failed to fetch company names");
        }
      } catch (error) {
        console.error("Error fetching company names:", error);
      }
    };

    fetchCompanyNames();
  }, []);

  const handleCompanyNameChange = (e) => {
    setSelectedCompany(e.target.value);
    setIsCompanySelected(true); // Set company selected to true when a company is selected
  };

  const handlePrintPage = () => {
    if (!isCompanySelected) {
      // If no company is selected, prevent printing
      alert("Please select a company name Branch before printing.");
      return;
    }

    document.title = `Quotation of ${quotationName}`;
    window.print();
    document.title = "Your Website Title";
  };

  const renderServiceTables = (subscriptionFrequency, serviceTypeTitle) => {
    const actualPriceTotal = quotations.reduce(
      (total, q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
          ? total + q.actual_price
          : total,
      0
    );

    const offerPriceTotal = quotations.reduce(
      (total, q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
          ? total + q.offer_price
          : total,
      0
    );

    const services = quotations.filter(
      (q) =>
        q.subscription_frequency === subscriptionFrequency &&
        q.service_type === serviceTypeTitle
    );
    const toggleRowVisibility = () => {
      setRowVisible(!rowVisible);
    };
  

    return (
      actualPriceTotal > 0 && (
        <div className="mt-1">
          <h5 className="fw-bold">{`${serviceTypeTitle} Services - ${subscriptionFrequency}`}</h5>
          <div className="" style={{ maxHeight: "auto", overflowY: "auto" }}>
            <table className="table table-bordered" >
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Service Name</th>
                  <th>Service Description</th>
                  <th>Actual Price(INR)</th>
                  <th>Offer Price(INR)</th>
                </tr>
              </thead>
              <tbody>
                {services.map((q, index) => (
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
                            //       "."}
                            //   </p>
                            // ))
                            }</td>
                    <td className="th">{q.actual_price}</td>
                    <td className="th">{q.offer_price}</td>
                  </tr>
                ))}
                {/* <tr>
                  <td colSpan="3" className="th ">
                    Total {`${serviceTypeTitle} Amount`}
                  </td>
                  <td className="thbold ">{actualPriceTotal}</td>
                  <td className="thbold ">{offerPriceTotal}</td>
                </tr> */}
                 {rowVisible && (
        <tr>
          <td colSpan="3" className="th">
            Total {`${serviceTypeTitle} Amount`}
          </td>
          <td className="thbold">{actualPriceTotal}</td>
          <td className="thbold">{offerPriceTotal}</td>
        </tr>
      )}
      <tr className="btn-row btn-print">
        <td colSpan="5">
          <button className="btn btn-primary" onClick={toggleRowVisibility}>
            {rowVisible ? "Hide" : "Show"}
          </button>
        </td>
      </tr>
   

              </tbody>
            </table>
          </div>
        </div>
      )
    );
  };

  const renderPaidServices = () => {
    return (
      <>
        {renderServiceTables("Monthly", "Paid")}
        {renderServiceTables("Yearly", "Paid")}
        {renderServiceTables("One Time", "Paid")}
        {renderServiceTables("Quarterly", "Paid")}
        {renderServiceTables("Half Yearly", "Paid")}
        {renderServiceTables("As Per Requirement", "Paid")}
        {renderServiceTables("1 Month", "Paid")}
        {renderServiceTables("2 Months", "Paid")}
        {renderServiceTables("3 Months", "Paid")}
        {renderServiceTables("4 Months", "Paid")}
        {renderServiceTables("5 Months", "Paid")}
        {renderServiceTables("6 Months", "Paid")}
        {renderServiceTables("7 Months", "Paid")}
        {renderServiceTables("8 Months", "Paid")}
        {renderServiceTables("9 Months", "Paid")}
        {renderServiceTables("10 Months", "Paid")}
        {renderServiceTables("11 Months", "Paid")}
        {renderServiceTables("12 Months", "Paid")}
        {renderServiceTables("Weekly", "Paid")}
        {renderServiceTables("15 Days", "Paid")}
        {renderServiceTables("10 Days", "Paid")}
        {renderServiceTables("1-5 Days", "Paid")}
        {/* Add similar calls for other subscription frequencies for Paid services */}
      </>
    );
  };

  const renderComplimentaryServices = () => {
    return (
      <>
        {renderServiceTables("Monthly", "Complimentary")}
        {renderServiceTables("Yearly", "Complimentary")}
        {renderServiceTables("One Time", "Complimentary")}
        {renderServiceTables("Quarterly", "Complimentary")}
        {renderServiceTables("Half Yearly", "Complimentary")}
        {renderServiceTables("As Per Requirement", "Complimentary")}
        {renderServiceTables("1 Month", "Complimentary")}
        {renderServiceTables("2 Months", "Complimentary")}
        {renderServiceTables("3 Months", "Complimentary")}
        {renderServiceTables("4 Months", "Complimentary")}
        {renderServiceTables("5 Months", "Complimentary")}
        {renderServiceTables("6 Months", "Complimentary")}
        {renderServiceTables("7 Months", "Complimentary")}
        {renderServiceTables("8 Months", "Complimentary")}
        {renderServiceTables("9 Months", "Complimentary")}
        {renderServiceTables("10 Months", "Complimentary")}
        {renderServiceTables("11 Months", "Complimentary")}
        {renderServiceTables("12 Months", "Complimentary")}
        {renderServiceTables("Weekly", "Complimentary")}
        {renderServiceTables("15 Days", "Complimentary")}
        {renderServiceTables("10 Days", "Complimentary")}
        {renderServiceTables("1-5 Days", "Complimentary")}
        {/* Add similar calls for other subscription frequencies for Complimentary services */}
      </>
    );
  };

  const renderWebsiteDevelopmentPaymentConditions = () => {
    // Find the service with the name "Website Design & Development"
    const websiteDevelopmentService = quotations.find(
      (service) => service.service_name === "Website Design & Development"
    );
    const moblieDevelopmentService = quotations.find(
      (service) =>
        service.service_name ===
        "Mobile Application Development (Android & IOS)"
    );
    const softwareDevelopmentService = quotations.find(
      (service) => service.service_name === "Software Development"
    );
    const graphicDesiginService = quotations.find(
      (service) => service.service_name === "Graphic & Logo Designing"
    );
    const videoEditingService = quotations.find(
      (service) => service.service_name === "Video Editing"
    );

    // Check if the service exists
    if (
      websiteDevelopmentService ||
      moblieDevelopmentService ||
      softwareDevelopmentService ||
      graphicDesiginService ||
      videoEditingService
    ) {
      return (
        <div className=" mt-2">
          <h4 className="mt-4">
            Payment Conditions for Website/Moblie/Software Development /Graphic
            & Logo Designing/Video Editing
          </h4>
        
          <EditablePaymentTable />
        </div>
      );
    } else {
      return null; // Return null if the service is not found
    }
  };

  const renderSEOPaymentConditions = () => {
    // Find the service with the name "SEO, SMO, and SMM"
    const seoService = quotations.find(
      (service) => service.service_name === "Search Engine Optimization (SEO)"
    );
    const smmService = quotations.find(
      (service) => service.service_name === "Social Media Marketing (SMM)"
    );
    const smoService = quotations.find(
      (service) => service.service_name === "Social Media Optimization (SMO)"
    );
    const bulkwhatsappService = quotations.find(
      (service) => service.service_name === "Bulk WhatsApp"
    );
    const youtubeService = quotations.find(
      (service) => service.service_name === "YouTube Optimization"
    );
    const GMBService = quotations.find(
      (service) => service.service_name === "Google My Business Assist"
    );
    const GoogleReviewsService = quotations.find(
      (service) => service.service_name === "Google Reviews"
    );
    const GooglePPCAdsService = quotations.find(
      (service) => service.service_name === "Google PPC Ads"
    );
    const websitemodifyService = quotations.find(
      (service) => service.service_name === "Website Modification & Maintenance"
    );

    // Check if the service exists
    if (
      seoService ||
      smmService ||
      smoService ||
      bulkwhatsappService ||
      youtubeService ||
      GMBService ||
      GoogleReviewsService ||
      GooglePPCAdsService ||
      websitemodifyService
    ) {
      return (
        <div className=" mt-2">
          <h4 className="mt-4">
            Payment Conditions for SEO/SMO/SMM/Bulk WhatsApp/YouTube
            Optimization/GMB/Google Reviews/Google PPC Ads/Website Modification
            & Maintenance
          </h4>
       
          <EditableSeoPayment />
        </div>
      );
    } else {
      return null; // Return null if the service is not found
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post(
          "https://quotation.queuemanagementsystemdg.com/api/company-header-footer",
          {
            company_name: selectedCompany,
          }
        );
        console.log(response);

        if (response.status === 200) {
          const {
            company_name_account_name,
            company_name_account_ifsc,
            company_name_account_number,
            company_address,
          } = response.data;
          setAccountName(company_name_account_name);
          setAccountIFSC(company_name_account_ifsc);
          setAccountNumber(company_name_account_number);
          setCompanyAddress(company_address);
        } else {
          console.error(
            "Error fetching header and footer images:",
            response.statusText
          );
        }
      } catch (error) {
        console.error(
          "Error fetching header and footer images:",
          error.message
        );
      }
    };

    fetchImages();
  });

  useEffect(() => {
    fetchQuotations();
    fetchNotes();
  }, []);

 

  const handleDelete = () => {
    navigate(`/deletecompanydata/${id}`);
  };

  const handleUpdate = () => {
    navigate(`/mainupdatecompanydata/${id}`);
  };

  return (
    <>
      <Wrapper >
      <div className="body">
        <div className="d-flex justify-content-between abs ">
          <div className="mx-3 mt-3 btn-print">
            {" "}
            <UserLogin />
          </div>
          <div className=" mt-3 mx-3 btn-print">
            {" "}
            <Logout />
          </div>
        </div>
        <div className="row mx-1">
          <div className="col-lg-9">
            <Link
              to={`/final-quotation/${id}`}
              className="btn btn-success mx-1 mt-3 mb-2 btn-print w-25 "
            >
              <i className="bi bi-arrow-return-left mx-1 "></i> Back
            </Link>
          </div>
          <div className="col-lg-3">
            {" "}
            <Link
              to="/quotationlist"
              className="text-white text-decoration-none btn btn-success mx-5 mt-3 w-75 btn-print "
            >
              Quotation List
            </Link>
          </div>

        
        </div>

        <div className="container">
          <button
            className="btn btn-success mb-3  mt-2  w-100 p-3   btn-print"
            onClick={handlePrintPage}
          >
            Print_Page
          </button>
        </div>
        {/* <Header/> */}
        <div className="container-fluid">
          <h1 className="btn-print">Select Company Data</h1>
          <select
            className="form-select btn-print"
            value={selectedCompany}
            onChange={handleCompanyNameChange}
            required
          >
            <option value="">Select Company</option>
            {companyNames.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
   

          <br />
        </div>
        <Header companyName={selectedCompany} quotationName={quotationName} />

        <div className="size mt-5">
          <h2>Plan & Quotation for {quotationName}</h2>
          {renderPaidServices()}
          {renderComplimentaryServices()}

          <div className="note mt-3">
            <h5 className=" fw-bold">Notes:-</h5>

            <ul>
              {notes.map((note) => (
                <li key={note.id}>
                  {note.note_text}
                  <p>{note.additional_info}</p>
                </li>
              ))}
              {/* <li>The payment is Non-Refundable.
              </li> */}
            </ul>
          </div>
          <div className=" mt-2">
            {renderWebsiteDevelopmentPaymentConditions()}
          </div>
          <div className=" mt-2 mb-3">{renderSEOPaymentConditions()}</div>

      
          <div className="">
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th colSpan="3" className="th text-center">
                    Payment Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr colSpan="3">
                  <td>{accountname}</td>
                  <td>{accountIFSC}</td>
                  <td>{accountNumber}</td>
                </tr>

                {/* Other payment details */}
              </tbody>
            </table>
          </div>
        </div>

        <div className=" mt-3 mb-2">
          <h6> Address : - {companyAddress}</h6>
        </div>

        {/* <div className="footimage ">
      <Footer /></div> */}
        <div className="container">
          <button
            className="btn btn-success mb-3  mt-2  w-100 p-3   btn-print"
            onClick={handlePrintPage}
          >
            Print_Page
          </button>
        </div>
        <Footer companyName={selectedCompany} />
        </div>
      </Wrapper>
      {/* <Lastpage/> */}
    </>
  );
}

export default Print_Page;
const Wrapper = styled.div`
  .thbold {
    font-weight: bold;
    font-size: 1.2rem;
  }
  th {
    font-weight: bold;
    font-size: 1rem;
  }
  .table {
    border: black;
  }
  .th {
    font-weight: bold;
    font-size: 1rem;
  }
  li {
    font-weight: bold;
    font-size: 1rem;
  }

@media print {
    .body {
        transform: scale(0.99); 
        transform-origin: top left;
    }
        
}


  .btn-print {
    @media print {
      display: none;
    }
  }

  .footimage {
    @media print {
      /* position: fixed; */
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
`;

