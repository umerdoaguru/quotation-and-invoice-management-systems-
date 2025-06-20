import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import img from "../../images/itsolution.png";

import moment from "moment";
import { useSelector } from "react-redux";

function PrintInvoice() {
  const { id } = useParams();
  const [duration, setDuration] = useState(""); // Initialize with Monthly as default
  const [invoice, setInvoice] = useState([]);
  const [invoiceName, setInvoiceName] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);

  const [invoice_no, setInvoice_no] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoice_Start_Date, setInvoice_Start_Date] = useState("");
  const [invoice_End_Date, setInvoice_End_Date] = useState("");
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [invoiceClientGst_no, setInvoiceClientGst_no] = useState("");
  const [invoiceClientGst_per, setInvoiceClientGst_per] = useState("");
  const [invoiceClientPan_no, setInvoiceClientPan_no] = useState("");
  const UserId = useSelector((state) => state.auth.user.id);
  const [accountname, setAccountName] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCharges, setCompanyCharges] = useState("");
  const [companyBank, setCompanyBank] = useState("");
  const [companySelected, setCompanySelected] = useState("");
  const [paymentMode, setpaymentMode] = useState("");
  const [advancePayment, setadvancePayment] = useState("");
  const [invoicecompanyType, setinvoicecompanyType] = useState("");
  const [invoiceGstType, setinvoiceGstType] = useState("");
  const [companyMoblie_no, setCompanyMoblie_no] = useState("");
  
  const [companyGST_no, setCompanyGST_no] = useState("");
  const [companyGST_per, setCompanyGST_per] = useState(0);
  const [companyPan_no, setCompanyPan_no] = useState("");
  const [companyEmail_id, setCompanyEmail_id] = useState("");
  const [companycharge, setCompanycharge] = useState("");
  const [companydigitalsign, setCompanydigitalsign] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();
 



  useEffect(() => {
    const fetchInvoiceAddress = async () => {
      try {
        const response = await axios.get(
          `https://quotation.queuemanagementsystemdg.com/api/invoice-address/${id}`
        );
        console.log(response.data);
        if (response.status === 200) {
          const { data } = response;
          console.log(data);
        
          setInvoiceAddress(data[0].invoice_address);

          setpaymentMode(data[0].payment_mode);
          setadvancePayment(data[0].advance_payment);
          setInvoiceClientGst_no(data[0].client_gst_no);
          setInvoiceClientGst_per(data[0].client_gst_per);
          setInvoiceClientPan_no(data[0].client_pan_no);
          setinvoicecompanyType(data[0].company_type);
          setInvoice_no(data[0].invoice_no);
          setInvoiceDate(data[0].invoice_date);
          setInvoice_Start_Date(data[0].duration_start_date);
          setInvoice_End_Date(data[0].duration_end_date);
          setInvoiceData(data[0]);
          

        } else {
          
        }
      } catch (error) {
        
      }
    };

    fetchInvoiceAddress();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `https://quotation.queuemanagementsystemdg.com/api/invoice/${id}`
      );
      if (response.status === 200) {
   

        setInvoiceName(response.data[0].invoice_name);
        setInvoice(response.data);
      }
    } catch (error) {
      
    }
  };


const gstpercentagehalf = (invoiceClientGst_per/2)
const gstpercentagefull= invoiceClientGst_per


  const renderServiceTables = (subscriptionFrequency, serviceTypeTitle ,   SelectGstType ) => {
   
    {
     let actualPriceTotal = 0;
     let offerPriceTotal = 0;
     let cgstTotalActualPrice = 0;
     let cgstTotalOfferPrice = 0;
     let sgstTotalOfferPrice = 0;
     let sgstTotalActualPrice = 0;
     let advancePaymentAmount = advancePayment;
     let gstTotalActualPrice = 0;
     let gstTotalOfferPrice = 0;
     
 
     const services = invoice.filter(
       (q) =>
         q.subscription_frequency === subscriptionFrequency &&
         q.service_type === serviceTypeTitle
     );
 
     services.forEach((q) => {
       actualPriceTotal += q.actual_price;
       offerPriceTotal += q.offer_price;
     });
 
 
     if (services.length > 0) {
       // Apply GST only for Doaguru Infosystems
       if (
       
         SelectGstType === "Excluding"
       ) {
         cgstTotalActualPrice = (actualPriceTotal * gstpercentagehalf) / 100;
         sgstTotalActualPrice = (actualPriceTotal * gstpercentagehalf) / 100;
         cgstTotalOfferPrice = (offerPriceTotal * gstpercentagehalf) / 100;
         sgstTotalOfferPrice = (offerPriceTotal * gstpercentagehalf) / 100;
       } else if (
         
         SelectGstType === "Excluding"
       ) {
         cgstTotalActualPrice = (actualPriceTotal * gstpercentagefull) / 100;
         cgstTotalOfferPrice = (offerPriceTotal * gstpercentagefull) / 100;
       } else if (
      
         SelectGstType === "Including"
       ) {
         gstTotalActualPrice = (actualPriceTotal * (100 / (100 + gstpercentagefull ) ) )
         gstTotalOfferPrice = (offerPriceTotal * (100 / (100 + gstpercentagefull ) ) )
       } 
       // Calculate the total payable amount excluding
       const totalPayableAmountActual =
         actualPriceTotal + cgstTotalActualPrice + sgstTotalActualPrice;
       const totalPayableAmountOffer =
         offerPriceTotal + cgstTotalOfferPrice + sgstTotalOfferPrice;
 
      
       // including
       const totalGstPayableAmountActual = parseFloat(
         gstTotalActualPrice.toFixed(2)
       );
       const totalGstPayableAmountOffer = parseFloat(
         gstTotalOfferPrice.toFixed(2)
       );
 
       // Calculate the remaining amount after deducting advance payment Excluding
 
  
       return (
         <div className=" ">
           <h5 className="">{`${serviceTypeTitle} Services - ${subscriptionFrequency}`}</h5>
           <div className="" style={{ maxHeight: "auto", overflowY: "auto" }}>
             <table className="table table-bordered" style={{ border: "black" }}>
               <thead>
                 <tr>
                   <th>Sr.No</th>
                   <th>Service Name</th>
                   <th>Actual Price(INR)</th>
                   <th>Offer Price(INR)</th>
                 </tr>
               </thead>
               <tbody>
                 {services.map((q, index) => (
                   <tr key={q.id}>
                     <td
                       className="text-center"
                       style={{ fontSize: "0.9rem", fontWeight: "bold" }}
                     >
                       {index + 1}
                     </td>
                     <td style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                       {q.service_name}
                     </td>
                     <td className="th">{q.actual_price}</td>
                     <td className="th">{q.offer_price}</td>
                   </tr>
                 ))}
                 <tr>
                   <td colSpan="2" className="th">
                     Total {`${serviceTypeTitle} Amount`}
                   </td>
                   <td className="thbold">{actualPriceTotal}</td>
                   <td className="thbold">{offerPriceTotal}</td>
                 </tr>
 
                 {/* Render GST rows if the selected company is Doaguru Infosystems */}
                 
                 {
                   serviceTypeTitle === "Paid" &&
                   SelectGstType === "Excluding" && (
                     <>
                       <tr>
                         <td colSpan="2" className="th text-center">
                           CGST {invoiceClientGst_per/2}%
                         </td>
                         <td className="thbold1">{cgstTotalActualPrice}</td>
                         <td className="thbold1">{cgstTotalOfferPrice}</td>
                       </tr>
                       <tr>
                         <td colSpan="2" className="th text-center">
                           SGST  {invoiceClientGst_per/2}%
                         </td>
                         <td className="thbold1">{sgstTotalActualPrice}</td>
                         <td className="thbold1">{sgstTotalOfferPrice}</td>
                       </tr>
                       <tr>
                         <td colSpan="2" className="th">
                           Total Payable Amount
                         </td>
                         <td className="thbold">{totalPayableAmountActual}</td>
                         <td className="thbold">{totalPayableAmountOffer}</td>
                       </tr>
                     </>
                   )}
 
                 {/* including */}
 
               
                 {
                   serviceTypeTitle === "Paid" &&
                   SelectGstType === "Including" && (
                     <>
                       <tr>
                         <td colSpan="2" className="th text-center">
                           GST {gstpercentagefull}%
                         </td>
                         <td className="thbold1">
                           {totalGstPayableAmountActual}
                         </td>
                         <td className="thbold1">
                           {totalGstPayableAmountOffer}
                         </td>
                       </tr>
                       <tr>
                         <td colSpan="2" className="th">
                           Total Payable Amount
                         </td>
                         <td className="thbold">
                           {totalGstPayableAmountActual}
                         </td>
                         <td className="thbold">{totalGstPayableAmountOffer}</td>
                       </tr>
                     </>
                   )}
 
         
               </tbody>
             </table>
           </div>
         </div>
       );
     } else {
       return null;
     }
   };
 };

  const renderPaidServices = ( invoiceGstType) => {
    return (
      <>
      
        {renderServiceTables("Monthly", "Paid", invoiceGstType)}
        {renderServiceTables("Yearly", "Paid", invoiceGstType)}
        {renderServiceTables("One Time", "Paid", invoiceGstType)}
        {renderServiceTables("Quarterly", "Paid", invoiceGstType)}
        {renderServiceTables("Half Yearly", "Paid", invoiceGstType)}
        {renderServiceTables("Weekly", "Paid", invoiceGstType)}
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
        {renderServiceTables("Weekly", "Complimentary")}
        {renderServiceTables("15 Days", "Complimentary")}
        {renderServiceTables("10 Days", "Complimentary")}
        {renderServiceTables("1-5 Days", "Complimentary")}
        {/* Add similar calls for other subscription frequencies for Complimentary services */}
      </>
    );
  };




  const fetchCompanyData = async (companyType) => {
    try {
      // Make a POST request to fetch data for the selected company
      const response = await axios.post(
        "https://quotation.queuemanagementsystemdg.com/api/company-name-data",
        {
          company_name: companyType,
        }
      );

      if (response.status === 200) {
        const {
          logo,
          company_name,
          company_name_account_name,
          company_name_account_ifsc,
          company_name_account_number,
          company_address,
          charges,
          bank,
          moblie_no,
          gst_no,
          pan_no,
          email_id,
          digital_sign
        } = response.data;
        console.log(response);

        // Update the component state with the fetched data
        setCompanyLogo(logo);
        setCompanyName(company_name)
        setAccountName(company_name_account_name);
        setAccountIFSC(company_name_account_ifsc);
        setAccountNumber(company_name_account_number);
        setCompanyAddress(company_address);
        setCompanyCharges(charges);
        setCompanyBank(bank);
        setCompanyMoblie_no(moblie_no);
        setCompanyGST_no(gst_no);
        setCompanyPan_no(pan_no);
        setCompanyEmail_id(email_id);
        setCompanydigitalsign(digital_sign);
      } else {
        
      }
    } catch (error) {
      
    }
    
  };


  useEffect(() => {
    fetchCompanyData(invoicecompanyType);
  }, [invoicecompanyType]);


  
  // const handlePrintPage = () => {
  //   if (companyGST_no) {
  //     // If the company GST number exists, prompt the user to select GST type before printing
  //     alert("Please select GST Type before printing.");
  //     return;
  //   }
  
  //   // If the company PAN number exists or if it doesn't exist (since we don't have a condition here), proceed with printing
  //   document.title = `Invoice of ${invoiceName}`;
  //   window.print();
  //   document.title = "Your Website Title";
  // };
  const handlePrintPage = () => {
    if (companyGST_no && !invoiceGstType) {
      // If the company GST number exists but the GST type is not selected, prompt the user to select GST type before printing
      alert("Please select GST Type before printing.");
      return;
    }
  
    // If the company PAN number exists or if it doesn't exist (since we don't have a condition here), proceed with printing directly, regardless of the selected GST type
    document.title = `Invoice of ${invoiceName}`;
    window.print();
    document.title = "Your Website Title";
  };
  

  const handleInvoiceGstTypeChange = (e) => {
    setinvoiceGstType(e.target.value);
  };




const fetchNotes = async () => {
  try {
    const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/invoice-get-notes/${id}`);

    if (response.status === 200) {
      setNotes(response.data);
    }
  } catch (error) {
    
  }
};


useEffect(() => {
  fetchInvoice();
 
  fetchNotes();
 
}, []);


const handleAddNotes = () => {
  navigate(`/invoicecreatenotes/${id}`);
};
const handleDeleteNotes = () => {
  navigate(`/invoicedeletenotes/${id}`);
};
const handleUpdateNotes = () => {
  navigate(`/invoice-update-notes/${id}`);
};


  return (
    <Wrapper>
      <div className="mx-3">
        <Link
          to={`/final-invoice/${id}`}
          className="btn btn-success mx-1 mt-3 mb-2 btn-print w-25 "
        >
          <i className="bi bi-arrow-return-left mx-1 "></i> Back
        </Link>

        <Link
          to="/invoicelist"
          className="text-white text-decoration-none btn btn-success mt-2 float-end w-25 btn-print"
        >
          Invoice List
        </Link>
      </div>

      <div className="container">
        <button
          className="btn btn-success mb-3  mt-2  w-100 p-3   btn-print"
          onClick={handlePrintPage}
        >
          Print_Page
        </button>
      </div>

      <div className="">
      
        <div className="d-flex">
          <div className="">
            <img
              src={companyLogo}
              height={200}
              width={200}
              alt=""
              style={{ marginTop: "0.5rem" }}
            />
          </div>
          <div className="details">
            <h6 style={{ lineHeight: "1.5rem", fontSize: "0.9rem" }}>
              {companyName} Address :- {companyAddress}
              <br /> Moblie Number:-{companyMoblie_no}<br />
              {companyGST_no > '' && (
                <>
                GST Number : - {companyGST_no} 
                </>
)}
              {companyPan_no > '' && (
                <>
                Pan Card No. : - {companyPan_no} 
                </>
)}
               {/* 8349121093 , 7440992424  */}
              <br /> Email Id :- {companyEmail_id}
            </h6>
          </div>

        </div>
        <div className="d-flex justify-content-between  th">
  <div className="">
    Invoice No :- {invoice_no} <Link to={`/update-invoice-number/${id}`} className="btn-print"  >Edit</Link>
  </div>
  <div className="">
    Invoice Date :- {moment(invoiceDate).format('DD-MM-YYYY')}  <Link to={`/update-invoice-date/${id}`}  className="btn-print" >Edit</Link>
  </div>
</div>
<div className="d-flex justify-content-between th">
  <div className="th ">
    Service Duration :- {moment(invoice_Start_Date).format('DD-MM-YYYY')} <Link to={`/update-invoice-start-date/${id}`} className="btn-print" >Edit</Link>&nbsp; to {moment(invoice_End_Date).format('DD-MM-YYYY')} <Link to={`/update-invoice-end-date/${id}`} className="btn-print" >Edit</Link>
  
  </div>
  <div className="">Payment Mode :- {paymentMode}</div>
</div>


        <div className="d-flex mt-3">
          <table class="table table-bordered" style={{ border: "black" }}>
            <thead>
              <tr>
                <th scope="col">
                  {" "}
                  <>BILL TO</>
                </th>
                <th scope="col">
                  {" "}
                  <>SHIP TO</>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{invoiceName}</strong>
                </td>
                <td>
                  {" "}
                  <strong>{invoiceName}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <h6>{invoiceAddress}</h6>
                </td>
                <td>
                  {" "}
                  <h6>{invoiceAddress}</h6>
                </td>
              </tr>
            {invoiceClientGst_no > " " && (

 <tr>
                
                <td>
               
                  <h6>GST:-{invoiceClientGst_no}</h6>
                </td>
                
           
                <td>
                  {" "}
                  <h6>GST:-{invoiceClientGst_no}</h6>
                </td>
              </tr>
 )}
            {invoiceClientPan_no > " " && (

 <tr>
                
                <td>
               
                  <h6>Pan Card :-{invoiceClientPan_no}</h6>
                </td>
                
           
                <td>
                  {" "}
                  <h6>Pan Card :-{invoiceClientPan_no}</h6>
                </td>
              </tr>
 )}


             
            </tbody>
          </table>
        </div>

        <div className="d-flex btn-print">
         
          {companyGST_no && (
              <div className="mx-1 btn-print">
                <>
                  <h4 className="btn-print">Select GST Type</h4>
                  <select
                    className="form-select"
                    id={`invoicegstType`}
                    name="invoicegsttype"
                    onChange={handleInvoiceGstTypeChange}
                    value={invoiceGstType}
                    required
                  >
                    <option value=""> Select Invoice GST Type</option>
                    <option value="Excluding">Excluding</option>
                    <option value="Including">Including</option>
                  </select>
                </>
              </div>
            )}
          {/* {companySelected === "Doaguru Infosystems IGST" && (
            <div className="mx-4 btn-print">
              <>
                <h4 className="btn-print">Select GST Type</h4>
                <select
                  className="form-select"
                  id={`invoicegstType`}
                  name="invoicegsttype"
                  onChange={handleInvoiceGstTypeChange}
                  value={invoiceGstType}
                >
                  <option value=""> Select Invoice GST Type</option>
                  <option value="Excluding">Excluding</option>
                  <option value="Including">Including</option>
                </select>
              </>
            </div>
          )} */}
        </div>

        {/* Render service tables based on the selected duration */}
        {/* {renderServices( "Paid", companySelected, invoiceGstType)}
        {renderServices( "Complimentary", companySelected)} */}
        


        {/* {renderPaidServices(companySelected, invoiceGstType)}
          {renderComplimentaryServices(companySelected, invoiceGstType)} */}
            {renderPaidServices( invoiceGstType)}
          {renderComplimentaryServices( invoiceGstType)}

    

<div className="note mt-3">
              <h5 className=" fw-bold mb-3">Notes:-</h5>

              <ul>
                {notes.map((note) => (
                  <li key={note.id} className="fw-bold " style={{ whiteSpace: "pre-line"}}>
                    {note.note_text}
                    <p>{note.additional_info}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="btn-print">
             
            
                 {" "}
                 <button
                   className="btn btn-primary mx-1  "
                   onClick={handleAddNotes}
                 >
                   Add Notes
                 </button>
           
             
                 {" "}
                 <button
                   className="btn btn-danger mx-1"
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
               
               
             </div>
      
        <div className="d-flex justify-content-between li1">
          <div className="">
            <h6>Bank Details</h6>
            <ul className="" style={{lineHeight:"2rem"}}>
              <li>Name : {accountname}</li>
              <li>IFSC Code : {accountIFSC} </li>
              <li>Account No : {accountNumber}</li>
              <li>Bank : {companyBank}</li>
            </ul>
          </div>
          <div className="">
            {/* <p className=" mx-3 fw-medium " style={{ marginTop: "8.5rem" }}>
              AUTHORISED SIGNATURE
            </p> */}

              <img
              src={companydigitalsign}
              height={200}
              width={200}
              alt=""
            
              style={{ marginTop: "1rem" }}
            />
          </div>
        </div>
        <div
              className="underline mx-auto"
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#34495E",
                marginTop: 0,
                marginBottom: 0,
              }}
            ></div>
  
        <div className="container">
          <button
            className="btn btn-success mb-3  mt-2  w-100 p-3   btn-print"
            onClick={handlePrintPage}
          >
            Print_Page
          </button>
        </div>
      </div>
    </Wrapper>
  );
}

export default PrintInvoice;

const Wrapper = styled.div`
  .th {
    font-weight: bold;
    font-size: 0.9rem;
  }
  .li1 {
    font-weight: bold;
    font-size: 0.9rem;
    padding: 0.3rem;
  }
  .thbold {
    font-weight: bold;
    font-size: 1rem;
  }
  .thbold1 {
    font-weight: bold;
    font-size: 0.9rem;
  }

  .btn-print {
    @media print {
      display: none;
    }
  }
  .borderremove {
    width: 5.2rem;
    @media print {
      border: none;
    }
  }
  .borderremove1 {
    width: 5.2rem;
    @media print {
      border: none;
    }
  }
  .date-input::-webkit-calendar-picker-indicator {
    display: none;
  }
  .details {
    margin-left: 7rem;
    @media screen and (max-width: 768px) {
      margin-left: 0.5rem;
    }
  }
 

  
`;
