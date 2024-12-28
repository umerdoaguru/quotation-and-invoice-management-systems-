import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function ServicenameList() {
    const [serviceList , SetServiceList] = useState([]);
    const userId = useSelector(state => state.auth.user.id);
   

    const fetchServicelist = async () =>{
        try {
            const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/servicelist/${userId}`);
            if (response.status === 200) {
                SetServiceList(response.data)
            } 
        } catch (error) {
            console.log("Error fetching ServiceList" , error);
        }
    }
    
    useEffect(()=>{
        fetchServicelist()
    },[]);
    
  return (
    <>
    <div className="mx-3">
      <Link
        to={`/create-company-profile`}
        className="btn btn-success mt-3 mx-2"
      >
        <i className="bi bi-arrow-return-left"></i> Back
      </Link>
      </div>
       <div className="container mt-3 mb-4">
        <h2>List of Service Name</h2>
       <ul className='list-group' style={{ maxHeight: "700px", overflowY: "auto" }}>
    {serviceList.map((service)=>(
<li key={service.service_id} className='list-group-item'>
{service.service_name}

</li>
    ))}

    
</ul>

<div className="mt-4">
<Link
                  className=" btn btn-success mx-1 "
                 to='/create-servicelist'
                >
                  Add
                </Link>
                /
                <Link
                  className="btn btn-secondary mx-1 "
                  to='/update-servicename'
                >
                  Edit
                </Link>
                /
                <Link
                  className="btn btn-danger mx-1  "
                 to="/delete-servicename"
                >
                  Delete
                </Link>
</div>
                  
                </div>
         
    
    </>
  )
}

export default ServicenameList