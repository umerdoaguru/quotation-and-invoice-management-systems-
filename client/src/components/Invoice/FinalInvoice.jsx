import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import UserLogin from '../../pages/UserLogin';
import Logout from '../../pages/Logout';
import UpdateInvoiceServices from './UpdateInvoiceServices';

function FinalInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [invoiceName, setInvoiceName] = useState([]);
  const [totalActualPrice, setTotalActualPrice] = useState(0);
  const [totalOfferPrice, setTotalOfferPrice] = useState(0);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  



  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `https://quotation-generator.dentalguru.software/api/invoice/${id}`
      );

      if (response.status === 200) {
        setInvoiceName(response.data[0].invoice_name);
        setInvoices(response.data);

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


  useEffect(() => {
    fetchInvoices();
   
  }, []);

  const filterServicesByType = (type) => {
    return invoices.filter((q) => q.service_type === type);
  };
  
  const handleDeleteService = async (serviceId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this row data?"
    );

    if (isConfirmed) {
      try {
        // Make an API call to delete the service
        const response = await axios.delete(
          `https://quotation-generator.dentalguru.software/api/invoice-service/${serviceId}`
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

  const handleAddServices = () => {
    navigate(`/addservicesinvoice/${id}`);
  };

  const handleUpdateSuccess = () => {
    console.log("Services updated successfully");
    setIsUpdateMode(false);
    // window.location.reload();
  };

  const handleUpdateError = () => {
    console.error("Error updating services");
    // Handle error, e.g., show an error message or update state
  };

  const handleReview = () => {
    navigate(`/review-invoice/${id}`);
    window.scrollTo(0, 0);
  };
  const handlePrintPage = () => {
    navigate(`/print-invoice/${id}`);
  };

  return (
   <>
     <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4   mt-3">
          
             <div className="mx-lg-4"><UserLogin /></div> 
            </div>
            <div className="col-lg-4  mt-3">
          
              <h5 className=" text-lg-center">Invoice Name:-{invoiceName}</h5>
            </div>
            <div className="col-lg-4 mt-3">
          
           <div className=" float-lg-end  mx-lg-2"> <Logout /></div>  
            </div>
            
          </div>

          <div className="container-fluid mt-4">
            <div className="row g-2">
              <div className="col-lg-3">
                {" "}
                <Link
                  to="/"
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
                  Update Invoice Services
                </button>{" "}
              </div>
              {isUpdateMode && (
                <UpdateInvoiceServices
                  invoiceId={id}
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
                  Add Invoice Services
                </button>
              </div>
              
             
              <div className="col-lg-3">
             
                  <Link
                    to="/invoicelist"
                    className="text-white text-decoration-none btn btn-success mx-1  w-100"
                  >
                    Invoice List
                  </Link>
               
              </div>
             
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
                      
                        <td className="th">{q.actual_price}</td>
                        <td className="th">{q.offer_price}</td>
                        <td className="th"> {q.subscription_frequency}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteService(q.service_invoice_id)}
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
                       
                        <td className="th">{q.actual_price}</td>
                        <td className="th">{q.offer_price}</td>
                        <td className="th"> {q.subscription_frequency}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteService(q.service_invoice_id)}
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
            <div className="col-lg-12 mt-2">
                <button
                  className="btn btn-success p-3 w-75 mb-2 w-100"
                  onClick={handlePrintPage}
                >
                  Print_Invoice
                </button>
              </div>


          </div>

    
        
        </div>
   
   
   </>
  )
}

export default FinalInvoice