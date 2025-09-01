import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function UpdateServiceList() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const userId = useSelector(state => state.auth.user.id);
    const [updatedServices, setUpdatedServices] = useState([]);
   
    const fetchServiceList = async () => {
        try {
            const response = await axios.get(`https://quotation-generator.dentalguru.software/api/servicelist/${userId}`);
            if (response.status === 200) {
                setServices(response.data);
                // Initialize updatedServices state with the fetched services
                setUpdatedServices(response.data.map(service => ({ ...service })));
            } 
        } catch (error) {
            console.error("Error fetching ServiceList", error);
        }
    }

    useEffect(() => {
        fetchServiceList();
    }, []);

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`https://quotation-generator.dentalguru.software/api/servicelist`, {
                services: updatedServices,
            });
            if (response.data.success) {
                console.log('Services updated successfully');
                navigate(`/servicenamelist`);
            }
        } catch (error) {
            console.error('Error updating services:', error);
        }
    };
    
    const handleChange = (index, event) => {
        const updatedServiceList = [...updatedServices];
        updatedServiceList[index] = { ...updatedServiceList[index], service_name: event.target.value };
        setUpdatedServices(updatedServiceList);
    };
      
    return (
       <>
       <div className="mx-3">
           <Link to={`/servicenamelist`} className="btn btn-success mt-3 mx-2">
               <i className="bi bi-arrow-return-left"></i> Back
           </Link>
           </div>
           <div className="container mt-2 mb-3">
               <h1>Update Services name</h1>
               <div className="form-control">
                   {services.map((service, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                className='form-control  mt-2'
                                value={updatedServices[index] ? updatedServices[index].service_name : service.service_name}
                                onChange={(event) => handleChange(index, event)}
                            />
                        </div>
                    ))}
                    <button className='btn btn-success mt-3' onClick={handleUpdate}>
                        Update Services name
                    </button>
                </div>
           </div>
       </>
    );
}

export default UpdateServiceList;
