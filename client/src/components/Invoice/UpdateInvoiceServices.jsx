import React , { useState, useEffect } from 'react'
import axios from 'axios';
const UpdateInvoiceServices = ({ invoiceId, onUpdateSuccess, onUpdateError }) => {
    const [
      services, setServices] = useState([]);
  
    const fetchServices = async () => {
      try {
        const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/invoice/${invoiceId}`);
        setServices(response.data);
  
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
   
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(`https://quotation.queuemanagementsystemdg.com/api/invoice/${invoiceId}`, {
          services,
  
        });
        
  
        if (response.data.success) {
          console.log('Services updated successfully');
          onUpdateSuccess();
        }
        
      } catch (error) {
        console.error('Error updating services:', error);
        onUpdateError();
      }
    };
  
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
    }, [invoiceId]);
  
    const handleUpdateClose = () =>{
      onUpdateSuccess();
    }
  
    return (
      <div className="container">
         <div className='form-control mb-2 mt-2'>
        {/* Form components for updating services */}
        {services.map((service, index) => (
          <div key={index}>
            <div className="row mt-3 g-2">
            <h6>Service {index + 1}</h6>
            <div className="col-lg-2 ">
            <label className="form-check-label">
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
            <label className="form-check-label">
            Subscription:
  
              <input
              className='form-control'
                type="text"
                value={service.subscription_frequency}
                onChange={(e) => handleServiceChange(index, "subscription_frequency", e.target.value)}
               
              />
            </label>
            </div>
                   
              
            <div className="col-lg-2 ">
            <label className="form-check-label">
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
  
            <label className="form-check-label">
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
            <label className="form-check-label">
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
  <button className='btn btn-success mt-2 mb-2' onClick={(e) => handleUpdate(e)}>Update Services</button>
  <button className='btn btn-danger mt-2 mb-2 mx-2' onClick={handleUpdateClose}>Cancel</button>
  
      </div>
      </div>
     
    );
  };

export default UpdateInvoiceServices