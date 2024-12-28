// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { useNavigate, useParams } from 'react-router-dom';

// const UpdateQuotationName = () => {
//     const {id} = useParams()
//     const [newName, setNewName] = useState('');
//     const [showModal, setShowModal] = useState(true);
//     const [quotationName, setQuotationName] = useState(""); 
//     const [message, setMessage] = useState('');
  
//     const navigate = useNavigate()

//     const fetchServices = async () => {
//         try {
//           const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/quotation-name/${id}`);
       
     
//           setQuotationName(response.data[0].quotation_name);

    
    
//         } catch (error) {
//           console.error('Error fetching services:', error);
//         }
//       };
//       useEffect(() => {
//         fetchServices();
//       },[id]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         try {
//             const response = await axios.put(`https://quotation.queuemanagementsystemdg.com/api/quotation-data/${id}`, { newName });

//             if (response.status === 200) {
//                 setMessage(response.data.message);
//                 navigate('/quotationlist')
//             } else {
//                 setMessage(response.data.error || 'Failed to update quotation name');
//             }
//         } catch (error) {
//             console.error('Error updating quotation name:', error);
//             setMessage('Internal Server Error');
//         }

//         // Close the modal after saving
//         setShowModal(false);
//     };

//     const handleClose = () => {
//         setShowModal(false); // Close the modal
//         navigate('/quotationlist')
//     };

 

//     return (
//         <Modal show={showModal} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Update Quotation Name</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group controlId="formNewName">
//                         <Form.Label>New Quotation Name</Form.Label>
//                         <Form.Control type="text" placeholder="Enter new Quotation name" value={quotationName} onChange={(e) => setNewName(e.target.value)} />
//                     </Form.Group>
//                     <Button variant="primary" type="submit" className='mt-3'>
//                         Save Changes
//                     </Button>
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>
//                     Close
//                 </Button>
//             </Modal.Footer>
//             {message && <p>{message}</p>}
//         </Modal>
//     );
// };

// export default UpdateQuotationName;


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateQuotationName = () => {
    const { id } = useParams();
    const [newName, setNewName] = useState('');
    const [showModal, setShowModal] = useState(true);
  
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuotationName = async () => {
            try {
                const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/quotation-name/${id}`);
                if (response.data && response.data.length > 0) {
             
                    setNewName(response.data[0].quotation_name); // Set default value for input
                }
            } catch (error) {
                console.error('Error fetching quotation name:', error);
            }
        };
        fetchQuotationName();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`https://quotation.queuemanagementsystemdg.com/api/quotation-data/${id}`, { newName });
            if (response.status === 200) {
                setMessage(response.data.message);
                navigate('/quotationlist');
            } else {
                setMessage(response.data.error || 'Failed to update quotation name');
            }
        } catch (error) {
            console.error('Error updating quotation name:', error);
            setMessage('Internal Server Error');
        }

        // Close the modal after saving
        setShowModal(false);
    };

    const handleClose = () => {
        setShowModal(false);
        navigate('/quotationlist');
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Quotation Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNewName">
                        <Form.Label>New Quotation Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter new Quotation name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className='mt-3'>
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} >
                    Close
                </Button>
            </Modal.Footer>
            {message && <p>{message}</p>}
        </Modal>
    );
};

export default UpdateQuotationName;

