
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from '../../pages/Logout';
import UserLogin from '../../pages/UserLogin';

const QuotationInvoice = () => {
  const [
    services, setServices] = useState([]);
    const [quotationName, setQuotationName] = useState([]);
    const [invoiceAddress, setInvoiceAddress] = useState("");
      const [invoicedata, setInvoicedata] = useState([]);
  const [paymentmode, setpaymentmode] = useState([]);
  const [invoiceAdvancePayment, setInvoiceAdvancePayment] = useState("");
  const [invoiceGST_or_Pan, setInvoiceGST_or_Pan] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [invoice_no, setInvoice_no] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoice_Start_Date, setInvoice_Start_Date] = useState("");
  const [invoice_End_Date, setInvoice_End_Date] = useState("");
  const [company_data, setCompany_data] = useState([]);
  const [companyGST_no, setCompanyGST_no] = useState("");
  const [companyPan_no, setCompanyPan_no] = useState("");
  const [invoiceClient_GST_no, setInvoiceClient_GST_no] = useState("");
  const [invoiceClient_Pan_no, setInvoiceClient_Pan_no] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();
    const userId = useSelector(state => state.auth.user.id);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`https://quotation-generator.dentalguru.software/api/quotation/${id}`);
      setServices(response.data);
      setQuotationName(response.data[0].quotation_name);
     
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  useEffect(() => {
    // Fetch existing data from the API
    const fetchCompanyData = async () => {
      try {
        const response = await axios.post('https://quotation-generator.dentalguru.software/api/company-header-footer', {
          company_name: selectedCompany
        });
        
        if (response.status === 200) {
          const companyData = response.data;
        

        // Set input field values with the fetched dat
        setCompanyGST_no(companyData.gst_no);
        setCompanyPan_no(companyData.pan_no);
       
       
        

     
        } else {
          console.error('Error Company Data:', response.statusText);
        }
       
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  },[selectedCompany] );
  useEffect(() => {
  const fetchInvoiceDataById = async () => {
    try {
      const response = await axios.get(`https://quotation-generator.dentalguru.software/api/invoice-data`);
      const data = response.data;

      setInvoicedata(data);

      if (data.length > 0) {
        // Find the max invoice number
        const maxInvoiceNo = Math.max(...data.map(inv => inv.invoice_no || 0));
        setInvoice_no(maxInvoiceNo + 1);  // Set next invoice number
      } else {
        setInvoice_no(1);  // First invoice if none exists
      }

    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  fetchInvoiceDataById();
}, []);



  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    // newServices[index][field] = value;
     
    if (field === 'service_type' && value === 'Complimentary') {
      // If the service type is 'Complimentary', disable the offer price and set it to 0
      newServices[index]['offer_price'] = 0;
    }
  
    if (field === 'offer_price' && newServices[index].service_type === 'Complimentary') {
      // If the service type is 'Complimentary', set offer price to 0 and disable the input
      newServices[index][field] = 0;
    } else if (field === 'offer_price' && value > newServices[index].actual_price) {
      // If offer price is greater than actual price, set it to actual price and alert
      alert("Offer price cannot be greater than actual price");
      newServices[index][field] = newServices[index].actual_price;
    } else {
      // Otherwise, update the field normally
      newServices[index][field] = value;
    }
    setServices(newServices);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchinvoice = async () => {
      try {
        const response = await axios.get(`https://quotation-generator.dentalguru.software/api/company-data/${userId}`);
        setCompany_data(response.data);
        
        console.log(response);
      } catch (error) {
        console.error("Error fetching Company_data:", error);
      }
    };

    fetchinvoice();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     

      const response = await axios.post("https://quotation-generator.dentalguru.software/api/create-invoice", {
        invoice_name: quotationName,
        invoice_no: invoice_no,
        invoice_address: invoiceAddress,
        payment_mode: paymentmode,
        // advance_payment: invoiceAdvancePayment,
        client_gst_no: invoiceClient_GST_no,
          client_pan_no: invoiceClient_Pan_no,
        services: services,
        user_id: userId,
        company_type: selectedCompany,
        invoice_date: invoiceDate,
        duration_start_date : invoice_Start_Date,
        duration_end_date : invoice_End_Date
      
      });

      console.log("Invoice added successfully:", response.data);

      navigate(`/final-invoice/${response.data.invoice.id}`);
    } catch (error) {
      console.error(
        "Error adding quotation:",
        error.response?.data || error.message
      );
    }
  };
  const handleChangeCompany = (e) => {
    setSelectedCompany(e.target.value);
  };
  


  return (
    <>
     <Link
        to={`/create-company-profile`}
        className="btn btn-success mt-3 mx-2"
      >
        <i className="bi bi-arrow-return-left"></i> Back
      </Link>
    <div className="container mt-5">
     
       <form className='form-control mb-2 '  onSubmit={handleSubmit}>
       
       <div className="row g-2  p-2">
              <div className="col-lg-3  ">
                {" "}
                <UserLogin />
              </div>

              <div className="col-lg-6 text-lg-center text-sm-start ">
                {" "}
                <h5 className="mb-4 ">
                  Invoice Generation System :
               
                </h5>
              </div>
              <div className="col-lg-2">
              <button className="btn btn-success ">
                    <Link
                      to="/invoicelist"
                      className="text-white text-decoration-none"
                    >
                      Invoice List
                    </Link>
                  </button>
              </div>
              <div className="col-lg-1  ">
                {" "}
                <Logout />
              </div>
            </div>
   
            <div className="row">
         
                            
            <div className="col-lg-12 mb-3">
                    <label className="form-check-label">
                   Select Enter Company name 
                      <select
                          className="form-select "
                          id="companyList"
                          name="company_list"
                          onChange={handleChangeCompany}
                          value={selectedCompany}
                          required
                     
                      >
                         <option value="" disabled>
            Select Company
          </option>
          {company_data.map((item, key) => (
                            <option key={key} value={item.company_name}>
                              {item.company_name}
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>
                  
              <div className="col-lg-3 mb-3">
                <input
                  type="number"
                  className="form-control text-center"
                  id="invoice_no"
                  name="invoice_no"
                  placeholder="Invoice Number"
                  value={invoice_no}
                  onChange={(e) => setInvoice_no(e.target.value)}
                  disabled
                  required
                />
              </div>
           <div className="col-lg-3 mb-3">
              <input
                type="text"
                className="form-control text-center"
                id="invoiceName"
                name="invoice_name"
                placeholder="Invoice Name"
                value={quotationName}
                onChange={(e) => setQuotationName(e.target.value)}
                required
              />
            </div>
            <div className="col-lg-3">
                <select
                  className="form-select"
                  id={`paymentMode`}
                  name="payment_mode"
                  onChange={(e) => setpaymentmode(e.target.value)}
                  value={paymentmode}
                  required
                >
                  <option value="" disabled>
                    Payment Mode
                  </option>
                  <option value="Payment Cheque">Payment Cheque</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  {/* Add other Payment Modes as needed */}
                </select>
              </div>
            
         {companyPan_no > '' && (
        <div className="col-lg-3 mb-3">
          
          <input
            type="text"
            className="form-control text-center"
            id="panCardNumber"
            name="pan_card_number"
            placeholder="Enter PAN Card Number (Optional)"
            value={invoiceClient_Pan_no}
            onChange={(e) => setInvoiceClient_Pan_no(e.target.value)}
            maxLength={10}
            
          />
        </div>
      )}
      {companyGST_no > ''   && (

        <div className="col-lg-3 mb-3">
          <input
            type="text"
            className="form-control text-center"
            id="gstNumber"
            name="gst_number"
            placeholder="Enter GST Number"
            value={invoiceClient_GST_no}
            onChange={(e) => setInvoiceClient_GST_no(e.target.value)}
            maxLength={15}
            required
          />
        </div>
      )}
           <div className="col-lg-3 mb-3">
              <textarea
                type="text"
                className="form-control text-center"
                id="invoiceName"
                name="invoice_address"
                placeholder="Enter the Invoice Address"
                value={invoiceAddress}
                onChange={(e) => setInvoiceAddress(e.target.value)}
                required
              />
            </div>
            
              <div className="col-lg-3 mb-3">
              <label className="form-check-label">
                    Invoice Date:                         
                <input
                  type="date"
                  className="form-control text-center"
                  id="invoiceDate"
                  name="invoiceDate"
                  placeholder="Invoice date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  required
                />
                </label>
              </div>
              <div className="col-lg-3 mb-3">
              <label className="form-check-label">
                    Invoice Duration Start Date:                
                <input
                  type="date"
                  className="form-control text-center"
                  id="invoice_Start_Date"
                  name="invoice_Start_Date"
                  placeholder="Invoice _Start_Date"
                  value={invoice_Start_Date}
                  onChange={(e) => setInvoice_Start_Date(e.target.value)}
                  required
                />
                </label>
              </div>
              <div className="col-lg-3 mb-3">
              <label className="form-check-label">
                    Invoice Duration End Date:                
                <input
                  type="date"
                  className="form-control text-center"
                  id="invoice_End_Date"
                  name="invoice_End_Date"
                  placeholder="Invoice _End_Date"
                  value={invoice_End_Date}
                  onChange={(e) => setInvoice_End_Date(e.target.value)}
                  required
                />
                </label>
              </div>

           </div>
      {/* Form components for updating services */}
      {services.map((service, index) => (
        <div key={index}>

          <div className="row mt-3 g-2  ">
          <h6 className='mt-3'>Service {index + 1}</h6>
          <div className="col-lg-2  ">
          <label className="form-check-label w-100 ">
          Service Type:

            <input
            className='form-control'
              type="text"
              value={service.service_type}
              onChange={(e) => handleServiceChange(index, "service_type", e.target.value)}
             
            />
          </label>
          </div>
                 
          <div className="col-lg-2 ">
          <label className="form-check-label w-100">
          Subscription:

            <input
            className='form-control'
              type="text"
              value={service.subscription_frequency}
              onChange={(e) => handleServiceChange(index, "subscription_frequency", e.target.value)}
             
            />
          </label>
          </div>
                 
            
          <div className="col-lg-3 ">
          <label className="form-check-label w-100">
            Service Name:
            <input
            className='form-control'
              type="text"
              value={service.service_name}
              onChange={(e) => handleServiceChange(index, 'service_name', e.target.value)}
             
            />
          </label>
          </div>
    

          <div className="col-lg-2 ">

          <label className="form-check-label w-100">
            Actual Price:
            <input
             className="form-control"
              type="number"
              value={service.actual_price}
              onChange={(e) => handleServiceChange(index, 'actual_price', parseFloat(e.target.value))}
            />
          </label>
          </div>


          <div className="col-lg-2 ">
          <label className="form-check-label w-100">
            Offer Price:
            <input
              className="form-control"
              type="number"
              value={service.offer_price}
              onChange={(e) => handleServiceChange(index, 'offer_price', parseFloat(e.target.value))}
            />
          </label>
          </div>
          </div>
        </div>
      ))}
      <button className='btn btn-success mt-2 mb-2' type='submit' >Submit</button>


    </form>
    </div>
    </>
    
   
  );
};

export default QuotationInvoice;
