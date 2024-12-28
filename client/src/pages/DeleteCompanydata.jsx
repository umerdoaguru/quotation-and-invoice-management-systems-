import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

function DeleteCompanydata() {
    const { id } = useParams();
    const UserId = useSelector(state => state.auth.user.id);
  const [companyNames , setCompanyNames] = useState([]);


  const handleDeleteCompanyData = async (CompanyName) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Company data?");
   if(isConfirmed){ try {
       const response = await axios.post('https://quotation.queuemanagementsystemdg.com/api/companydata', {
        company_name: CompanyName
      });
       
       
       
      if (response.status === 200) {
        console.log('Company Data deleted successfully');
        // Refresh CompanyDatas after deletion
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting Company Data:', error);
    } 
  }
  };

    useEffect(() => {
        // Fetch company names from the backend
        const fetchCompanyNames = async () => {
          try {
            const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/header-footer-images/company-names/${UserId}`);
            if (response.status === 200) {
              setCompanyNames(response.data); // Assuming response.data is an array of company names
       
            } else {
              console.error('Failed to fetch company names');
            }
          } catch (error) {
            console.error('Error fetching company names:', error);
          }
        };
    
        fetchCompanyNames();
      }, []);


    

  return (
    <>
    <div className="container mt-4">
      <h1>Delete Comapany Data </h1>
      <ul className="list-group">
        {companyNames.map((company) => (
          <li key={company} className='list-group-item'>
            {company}
          
            <button className="btn btn-danger mx-3 float-end" onClick={() => handleDeleteCompanyData(company)}>
              Delete Company
            </button>
          </li>
        ))}
      </ul>
      <br />
      <Link to={`/`} className="btn btn-primary">
        Back
      </Link>
    </div>
    
    
    
    </>
  )
}

export default DeleteCompanydata