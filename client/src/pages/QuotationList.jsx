


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import moment from 'moment';
// import { useSelector } from "react-redux";

// const QuotationList = () => {
//   const [quotations, setQuotations] = useState([]);
//   const UserId = useSelector(state => state.auth.user.id);

//   useEffect(() => {
//     const fetchQuotations = async () => {
//       try {
//         const response = await axios.get(`https://quotation-generator.dentalguru.software/api/quotation-data/${UserId}`);
//         setQuotations(response.data);
//         console.log(response);
//       } catch (error) {
//         console.error("Error fetching quotations:", error);
//       }
//     };

//     fetchQuotations();
//   }, [UserId]);
  
//   const handleDelete = async (id) => {
//     // Display a confirmation dialog
//     const isConfirmed = window.confirm(
//       "Are you sure you want to delete this quotation?"
//     );

//     if (isConfirmed) {
//       try {
//         const response = await axios.delete(
//           `https://quotation-generator.dentalguru.software/api/quotation/${id}`
//         );

//         if (response.status === 200) {
//           console.log("Quotation deleted successfully");
//           window.location.reload();
//         }
//       } catch (error) {
//         console.error("Error deleting quotation:", error);
//       }
//     }
//   };

//   const handleCopyQuotation = async (quotationId) => {
//     try {
//       const response = await axios.post(`https://quotation-generator.dentalguru.software/api/copy-quotation/${quotationId}`);
//       console.log(response.data.message);
//       window.location.reload();
//     } catch (error) {
//       console.error("Error copying quotation:", error);
//       // Handle the error, show an error message, or perform any necessary actions
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>List of Quotations</h2>
//       <div className="" style={{ maxHeight: "700px", overflowY: "auto" }}>
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Quotation Name</th>
//               <th>Created Date</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {quotations.map((quotation, index) => (
//               <tr key={quotation.quotation_id}>
//                 <td>{index + 1}</td>
//                 <td>{quotation.quotation_name}</td>
//                 <td>{moment(quotation.created_date).format('DD/MM/YYYY')}</td>
//                 <td>
//                   <Link to={`/final-quotation/${quotation.quotation_id}`}>
//                     <button className="btn btn-success m-1">View</button>
//                   </Link>
//                   <button className="btn btn-danger mx-sm-0 mx-lg-2 m-1" onClick={() => handleDelete(quotation.quotation_id)}>Delete</button>
//                   <Link to={`/update-quotation-name/${quotation.quotation_id}`}>
//                     <button className="btn btn-secondary m-1">Edit</button>
//                   </Link>
//                   <button className="btn btn-primary m-1" onClick={() => handleCopyQuotation(quotation.quotation_id)}>Copy</button>
//                   <Link to={`/quotation-invoice/${quotation.quotation_id}`}>
//                     <button className="btn btn-warning m-1 text-white">Invoice</button>
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Link to="/" className="text-white">
//         <button className='btn btn-success mt-4 mb-3'>
//           <i className="bi bi-arrow-return-left mx-1"></i>Back
//         </button>
//       </Link>
//     </div>
//   );
// };

// export default QuotationList;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from 'moment';
import { useSelector } from "react-redux";
import ReactPaginate from 'react-paginate';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const UserId = useSelector(state => state.auth.user.id);

  useEffect(() => {
  

    fetchQuotations();
  }, [UserId]);
  const fetchQuotations = async () => {
    try {
      const response = await axios.get(`https://quotation-generator.dentalguru.software/api/quotation-data/${UserId}`);
      setQuotations(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this quotation?");
    if (isConfirmed) {
      try {
        const response = await axios.delete(`https://quotation-generator.dentalguru.software/api/quotation/${id}`);
        if (response.status === 200) {
          console.log("Quotation deleted successfully");
        fetchQuotations();
        }
      } catch (error) {
        console.error("Error deleting quotation:", error);
      }
    }
  };

  const handleCopyQuotation = async (quotationId) => {
    try {
      const response = await axios.post(`https://quotation-generator.dentalguru.software/api/copy-quotation/${quotationId}`);
      console.log(response.data.message);
      fetchQuotations();
      filteredQuotations()
      
    } catch (error) {
      console.error("Error copying quotation:", error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleSortChange = () => {
    setSortAsc(!sortAsc);
  };

  const filteredQuotations = quotations
    .filter(quotation => quotation.quotation_name.toLowerCase().includes(filterText.toLowerCase()))
    

  const offset = currentPage * itemsPerPage;
  const currentQuotations = filteredQuotations.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredQuotations.length / itemsPerPage);

  return (
    <>
    <div className="container-fluid mx-2">
    <Link to="/" className="text-white">
        <button className='btn btn-success mt-2'>
          <i className="bi bi-arrow-return-left mx-1"></i>Back
        </button>
      </Link>
    </div>
      <div className="container ">
      
      <h2>List of Quotations</h2>
      <div className="d-flex justify-content-between mb-2">
        <input
          type="text"
          placeholder="Filter by Quotation Name"
          value={filterText}
          onChange={handleFilterChange}
          className="form-control w-50"
        />
      
      </div>
      <div className="" style={{ overflowY: "auto" }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quotation Name</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentQuotations.map((quotation, index) => (
              <tr key={quotation.quotation_id}>
                <td>{offset + index + 1}</td>
                <td>{quotation.quotation_name}</td>
                <td>{moment(quotation.created_date).format('DD/MM/YYYY')}</td>
                <td>
                  <Link to={`/final-quotation/${quotation.quotation_id}`}>
                    <button className="btn btn-success m-1">View</button>
                  </Link>
                  <button className="btn btn-danger mx-sm-0 mx-lg-2 m-1" onClick={() => handleDelete(quotation.quotation_id)}>Delete</button>
                  <Link to={`/update-quotation-name/${quotation.quotation_id}`}>
                    <button className="btn btn-secondary m-1">Edit</button>
                  </Link>
                  <button className="btn btn-primary m-1" onClick={() => handleCopyQuotation(quotation.quotation_id)}>Copy</button>
                  <Link to={`/quotation-invoice/${quotation.quotation_id}`}>
                    <button className="btn btn-warning m-1 text-white">Invoice</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination justify-content-center'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      </div>
   
    </div>
    </>
    
  
  );
};

export default QuotationList;

