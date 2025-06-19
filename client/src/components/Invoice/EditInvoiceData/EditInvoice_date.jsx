


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const EditInvoice_date = () => {
    const { id } = useParams();
    const [newInvoice_date, setNewInvoice_date] = useState('');
    
         const [invoiceData, setInvoiceData] = useState([]);
         const [invoiceDataService, setInvoiceDataService] = useState([]);

    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();

 

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
          
            const response = await axios.post(`https://quotation.queuemanagementsystemdg.com/api/invoice-after-edit`, {
       
        
          invoice_name: invoiceData.invoice_name,
          invoice_no: invoiceData.invoice_no,
          invoice_address: invoiceData.invoice_address,  
          payment_mode: invoiceData.payment_mode,
          client_gst_no: invoiceData.client_gst_no,
          client_gst_per: invoiceData.client_gst_per,
          client_pan_no: invoiceData.client_pan_no,
          services: invoiceDataService,
          user_id: invoiceData.user_id,
          company_type: invoiceData.company_type,
          invoice_date: newInvoice_date,
          duration_start_date : invoiceData.duration_start_date,
          duration_end_date : invoiceData.duration_end_date
        

          
        });
            if (response.status === 200) {
               
            
            } 
            navigate(`/print-invoice/${id}`);
        } catch (error) {
            console.error('Error updating Invoice name:', error);
          
        }

        // Close the modal after saving
        setShowModal(false);
    };

    const handleClose = () => {
        setShowModal(false);
        navigate(`/print-invoice/${id}`);
    };
      const getQuotationName = async () => {
    try {
      const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/invoice-name/${id}`);
      setInvoiceData(response.data[0]);
      
      
    } catch (error) {
      console.log('Error fetching quotation name:', error);
    }
  };
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `https://quotation.queuemanagementsystemdg.com/api/invoice/${id}`
      );

      if (response.status === 200) {
     
        setInvoiceDataService(response.data);

      
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  useEffect(()=>{
 getQuotationName();
 fetchInvoices();
  },[])

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Invoice Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNewName">
                        <Form.Label>New Invoice Date</Form.Label>
                        <Form.Control type="date" placeholder="Enter new Invoice Date" value={newInvoice_date} onChange={(e) => setNewInvoice_date(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className='mt-3'>
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
         
        </Modal>
    );
};

export default EditInvoice_date;

