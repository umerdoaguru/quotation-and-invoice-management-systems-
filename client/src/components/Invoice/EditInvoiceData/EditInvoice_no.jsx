


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const EditInvoice_no = () => {
    const { id } = useParams();
    const [newInvoice_no, setNewInvoice_no] = useState('');
    
    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();

 

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
          
            const response = await axios.put(`https://quotation.queuemanagementsystemdg.com/api/invoice-no/${id}`, { newInvoice_no});
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
                <Modal.Title>Update Invoice Number</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNewName">
                        <Form.Label>New Invoice Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter new Invoice number" value={newInvoice_no} onChange={(e) => setNewInvoice_no(e.target.value)} />
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

export default EditInvoice_no;

