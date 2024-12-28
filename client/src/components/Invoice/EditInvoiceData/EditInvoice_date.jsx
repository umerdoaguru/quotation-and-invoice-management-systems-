


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const EditInvoice_date = () => {
    const { id } = useParams();
    const [newInvoice_date, setNewInvoice_date] = useState('');
    
    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();

 

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
          
            const response = await axios.put(`https://quotation.queuemanagementsystemdg.com/api/invoice-date/${id}`, { newInvoice_date});
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

