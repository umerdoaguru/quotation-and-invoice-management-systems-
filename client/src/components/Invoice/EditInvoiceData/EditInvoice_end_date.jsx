


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const EditInvoice_end_date = () => {
    const { id } = useParams();
    const [newInvoice_end_date, setNewInvoice_end_date] = useState('');
    
    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();

 

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
          
            const response = await axios.put(`https://quotation.queuemanagementsystemdg.com/api/invoice-end-date/${id}`, { newInvoice_end_date});
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

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Invoice End Duration Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNewName">
                        <Form.Label>New Invoice End Duration Date</Form.Label>
                        <Form.Control type="date" placeholder="Enter new Invoice End Duration Date" value={newInvoice_end_date} onChange={(e) => setNewInvoice_end_date(e.target.value)} />
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

export default EditInvoice_end_date;

