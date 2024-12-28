import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { styled } from "styled-components";



function Reviews({ handleClose }) {

  const { id } = useParams();
  const [quotations, setQuotations] = useState([]);
  const [quotationDate, setQuotationDate] = useState(""); // New state to store quotation name
  const [quotationName, setQuotationName] = useState(""); 

 
 
  const [notes, setNotes] = useState([]); 
  const [footerImagePath, setFooterImagePath] = useState("");

  
  const [headerImagePath, setHeaderImagePath] = useState("");

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `
        https://quotation.queuemanagementsystemdg.com/api/quotation/${id}`
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
      const response = await axios.get(
        `
        https://quotation.queuemanagementsystemdg.com/api/notes/${id}`
      );

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };
  const fetchHeaderImage = async () => {
    try {
      const response = await axios.get(
        `
        https://quotation.queuemanagementsystemdg.com/api/${id}/header`
      );

      if (response.status === 200) {
        // Assuming your response.data structure contains the image URL
        setHeaderImagePath(response.data[0]?.file_path);
        console.log("Footer Image URL:", headerImagePath);
      }
    } catch (error) {
      console.error("Error fetching footer image:", error);
    }
  };



  const handlePrintPage = () => {
    
  
    window.print();
  
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

    return (
      actualPriceTotal > 0 && (
        <div className="mt-1">
          <h5 className="fw-bold">{`${serviceTypeTitle} Services - ${subscriptionFrequency}`}</h5>
          <div className="" style={{ maxHeight: "700px", overflowY: "auto" }}>
            
          <table className="table table-bordered mt-3">
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
                  <td className="text-center" style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    {index + 1}
                  </td>
                  <td style={{ fontSize: "1rem", fontWeight: "bold" }}>{q.service_name}</td>
                  <td>{q.service_description}</td>
                  <td className="th">{q.actual_price}</td>
                  <td className="th">{q.offer_price}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="th">
                  Total {`${serviceTypeTitle} Amount`}
                </td>
                <td className="th">{actualPriceTotal}</td>
                <td className="th">{offerPriceTotal}</td>
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
        {renderServiceTables("Weekly", "Paid")}
        {renderServiceTables("As Per Requirement", "Paid")}
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
        {renderServiceTables("As Per Requirement", "Complimentary")}
        {renderServiceTables("15 Days", "Complimentary")}
        {renderServiceTables("10 Days", "Complimentary")}
        {renderServiceTables("1-5 Days", "Complimentary")}
        {/* Add similar calls for other subscription frequencies for Complimentary services */}
      </>
    );
  };



  
  useEffect(() => {
    fetchQuotations();
    fetchNotes();
    
   
  }, []); 

  return (
    <>

  


      <Wrapper>

        <div className="container-fluid">
<Link to={`/final-quotation/${id}`} className="btn btn-success mx-1 mt-3 mb-2 btn-print ">
<i className="bi bi-arrow-return-left mx-1"></i>  Back
            </Link>
           

<div className="size">

    
  {/* <td style={{ fontSize: "1rem", fontWeight: "bold" }}>Date: { moment(quotationDate).format('DD/MM/YYYY')}</td> */}
       
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
              </ul>
            </div>
       
       

    
      
      </div>  
  
  
           {/* <div className=" footimage">
      <Footer /></div>  */}
      <Link to={`/final-quotation/${id}`} className="btn btn-success mx-1 mt-3 mb-2 btn-print ">
<i className="bi bi-arrow-return-left mx-1"></i>  Back
            </Link>

</div>
      </Wrapper>



      
     
             
    </>
  );
}

export default Reviews;
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
  li{
    font-weight:bold;
    font-size: 1rem;

  }

  .btn-print{
    @media print{
      display: none;
    }
  } 
  .no-print {
    display: none;

    @media print {
      display: block;
    }
  }

  .footimage {

    @media print{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    
    }
  }

 

`;



