
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UpdateServicesForm = ({ quotationId, onUpdateSuccess, onUpdateError }) => {
//   const [services, setServices] = useState([]);

//   const fetchServices = async () => {
//     try {
//       const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/quotation/${quotationId}`);
//       setServices(response.data);

//     } catch (error) {
//       console.error('Error fetching services:', error);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(`https://quotation.queuemanagementsystemdg.com/api/quotation/${quotationId}`, {
//         services,

//       });
      

//       if (response.data.success) {
//         console.log('Services updated successfully');
//         onUpdateSuccess();
//       }
      
//     } catch (error) {
//       console.error('Error updating services:', error);
//       onUpdateError();
//     }
//   };

//   const handleServiceChange = (index, field, value) => {
//     const newServices = [...services];
//     // newServices[index][field] = value;
     
//     if (field === 'service_type' && value === 'Complimentary') {
//       // If the service type is 'Complimentary', disable the offer price and set it to 0
//       newServices[index]['offer_price'] = 0;
//     }
  
//     if (field === 'offer_price' && newServices[index].service_type === 'Complimentary') {
//       // If the service type is 'Complimentary', set offer price to 0 and disable the input
//       newServices[index][field] = 0;
//     } else if (field === 'offer_price' && value > newServices[index].actual_price) {
//       // If offer price is greater than actual price, set it to actual price and alert
//       alert("Offer price cannot be greater than actual price");
//       newServices[index][field] = newServices[index].actual_price;
//     } else {
//       // Otherwise, update the field normally
//       newServices[index][field] = value;
//     }
//     setServices(newServices);
//   };

//   useEffect(() => {
//     fetchServices();
//   }, [quotationId]);

//   return (
//     <div className="container">
//        <div className='form-control'>
//       {/* Form components for updating services */}
//       {services.map((service, index) => (
//         <div key={index}>
//           <div className="row">
//           <div className="col-lg-2">
//           <label className="form-check-label">
//           Subscription Frequency:

//             <input
//             className='form-control'
//               type="text"
//               value={service.subscription_frequency}
//               onChange={(e) => handleServiceChange(index, "subscription_frequency", e.target.value)}
             
//             />
//           </label>
//           </div>
                 
            
//           <div className="col-lg-3">
//           <label className="form-check-label">
//             Service Type:
//             <input
//             className='form-control'
//               type="text"
//               value={service.service_type}
//               onChange={(e) => handleServiceChange(index, 'service_type', e.target.value)}
             
//             />
//           </label>
//           </div>
//           <div className="col-lg-3">

//           <label className="form-check-label">
//             Service Description:
//             <textarea
//              rows="3" cols="90"
//               className="form-control"
//               value={service.service_description}
//               onChange={(e) => handleServiceChange(index, 'service_description', e.target.value)}
//             />
//           </label>
//           </div>

//           <div className="col-lg-2">

//           <label className="form-check-label">
//             Actual Price:
//             <input
//              className="form-control"
//               type="number"
//               value={service.actual_price}
//               onChange={(e) => handleServiceChange(index, 'actual_price', parseFloat(e.target.value))}
//             />
//           </label>
//           </div>


//           <div className="col-lg-2">
//           <label className="form-check-label">
//             Offer Price:
//             <input
//               className="form-control"
//               type="number"
//               value={service.offer_price}
//               onChange={(e) => handleServiceChange(index, 'offer_price', parseFloat(e.target.value))}
//             />
//           </label>
//           </div>
//           </div>
//         </div>
//       ))}
// <button className='btn btn-success' onClick={(e) => handleUpdate(e)}>Update Services</button>

//     </div>
//     </div>
   
//   );
// };

// export default UpdateServicesForm;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UpdateServicesForm = ({ quotationId, onUpdateSuccess, onUpdateError }) => {
    const userId = useSelector(state => state.auth.user.id);
  
  const [
    services, setServices] = useState([]);
      const [subscriptionFrequencies, setSubscriptionFrequencies] = useState([
        "Yearly",
        "Monthly",
        "Quarterly",
        "Half Yearly",
        "One Time",
        "As Per Requirement",
        "1 Month",
        "2 Months",
        "3 Months",
        "4 Months",
        "5 Months",
        "6 Months",
        "7 Months",
        "8 Months",
        "9 Months",
        "10 Months",
        "11 Months",
        "12 Months",
        "15 Days",
        "10 Days",
        "Weekly",
        "1-5 Days"
       
    
      ]);
      const [serviceslist, setServiceslist] = useState([]);
        const [otherServices, setOtherServices] = useState(
          Array(services.length).fill("")
        );

  const fetchServices = async () => {
    try {
      const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/quotation/${quotationId}`);
      setServices(response.data);

    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

 const getServicelist = async () => {
      try {
        const res = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/servicelist/${userId}`);
        console.log(res.data);
        setServiceslist(res.data);
      } catch (error) {
        console.log("error", error);
      }
    };

  const handleUpdate = async (e) => {
    e.preventDefault();
   
    try {
      const response = await axios.put(`https://quotation.queuemanagementsystemdg.com/api/quotation/${quotationId}`, {
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

  function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset the height to auto first
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height based on scrollHeight
    textarea.style.overflow = 'hidden'; // is se overflow hide kr diya 
}




  useEffect(() => {
    fetchServices();
    getServicelist()
  }, [quotationId]);

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
          <div className="col-lg-12 ">
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
                 
          {/* <div className="col-lg-2 ">
          <label className="form-check-label">
          Subscription:

            <input
            className='form-control'
              type="text"
              value={service.subscription_frequency}
              onChange={(e) => handleServiceChange(index, "subscription_frequency", e.target.value)}
             
            />
          </label>
          </div> */}
                 
            
        

          <div className="col-lg-2">
                    <label className="form-check-label">
                      Subscription:
                      <select
                        className="form-select"
                        id={`subscriptionFrequency${index}`}
                        name="subscription_frequency"
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "subscription_frequency",
                            e.target.value
                          )
                        }
                        value={service.subscription_frequency}
                        required
                      >
                        <option value="" disabled>
                          Select Subscription Frequency
                        </option>
                        {subscriptionFrequencies.map((frequency, key) => (
                          <option key={key} value={frequency}>
                            {frequency}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {/* <div className="col-lg-2">
                    <label className="form-check-label">
                      Service Name:
                     
                        <select
                          className="form-select"
                          id={`servicename${index}`}
                          name="service_name"
                          onChange={(e) =>  handleServiceChange(
                            index,
                            "service_name",
                            e.target.value
                          )}
                          value={service.service_name}
                          required
                        >
                          <option value="" disabled>
                            Select Service name
                          </option>
                          {serviceslist.map((item, key) => (
                            <option key={key} value={item.service_name}>
                              {item.service_name}
                            </option>
                          ))}
                        
                        </select>
                   
                    </label>
                 
                  </div> */}
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


          <div className="col-lg-4 ">

          <label className="form-check-label">
            Service Description:
                <textarea
                  rows="3" cols="90"
                  spellCheck='true'
                  className="form-control"
                  value={service.service_description}
                  onChange={(e) => {
                    handleServiceChange(index, 'service_description', e.target.value);
                    autoResize(e.target); // Call autoResize function
                  }}
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

export default UpdateServicesForm;
