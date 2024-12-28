import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const CreateServicelist = () => {
  const navigate = useNavigate()
    const userId = useSelector(state => state.auth.user.id);
  const [services, setServices] = useState([
    { service_name: '' }, // Initialize with an empty service
  ]);

  const addService = () => {
    setServices([...services, { service_name: '' }]);
  };

  const handleServiceChange = (index, event) => {
    const newServices = [...services];
    newServices[index].service_name = event.target.value;
    setServices(newServices);
  };

  const removeService = (index) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`https://quotation.queuemanagementsystemdg.com/api/create-servicelist/${userId}`, {
        services: services.filter(service => service.service_name.trim() !== ''), // Filter out empty services
      });
      console.log(response.data); // Log the response from the server
      navigate('/servicenamelist')
    } catch (error) {
      console.error('Error creating services:', error);
    }
  };

  return (
    <>
<div className="mx-3">
<Link
        to={`/servicenamelist`}
        className="btn btn-success mt-3 mx-2"
      >
        <i className="bi bi-arrow-return-left"></i> Back
      </Link>
      </div>
    
    <div className='container mt-2' >
      
      <h2>Create Services</h2>
      <form onSubmit={handleSubmit} className='form-control'>
        {services.map((service, index) => (
          <div className='d-flex justify-content-between' key={index}>
            
            <input
            className='form-control w-75 mt-2'
              type="text"
              value={service.service_name}
              onChange={(event) => handleServiceChange(index, event)}
              placeholder="Enter service name"
            />
              <button type="button" className='btn btn-danger mt-2' onClick={() => removeService(index)}>Remove</button>
          </div>
        ))}
        <button type="button" className='btn btn-success mt-3' onClick={addService}>Add Service</button>
        <br />
        <button type="submit" className='btn btn-success mt-3'>Create Services</button>
      </form>
    </div>
    </>
    
  );
};

export default CreateServicelist;
