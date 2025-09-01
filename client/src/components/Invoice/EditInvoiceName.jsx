import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditInvoiceName = () => {
  const { id } = useParams();
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newpaymentMode, setNewpaymentMode] = useState("");
  const [newadavacePayment, setNewadavacePayment] = useState("");
  const [newGST_or_Pan, setNewGST_or_Pan] = useState("");
  const [newcompany_type, setNewcompany_type] = useState("");
  const [newClient_GST_no, setnewClient_GST_no] = useState("");
  const [newClient_GST_per, setnewClient_GST_per] = useState("");
  const [newClient_Pan_no, setnewClient_Pan_no] = useState("");
  const [showModal, setShowModal] = useState(true);

  const [message, setMessage] = useState("");   
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotationName = async () => {
      try {
        const response = await axios.get(
          `https://quotation-generator.dentalguru.software/api/invoice-name/${id}`
        );
        if (response.data && response.data.length > 0) {
          setNewName(response.data[0].invoice_name); // Set default value for input
          setNewAddress(response.data[0].invoice_address);
          setNewpaymentMode(response.data[0].payment_mode);
          setNewGST_or_Pan(response.data[0].client_gst_or_pan);
          setNewcompany_type(response.data[0].company_type);
          setnewClient_GST_no(response.data[0].client_gst_no);
          setnewClient_GST_per(response.data[0].client_gst_per);
          setnewClient_Pan_no(response.data[0].client_pan_no);

          // setNewadavacePayment(response.data[0].advance_payment)
        }
      } catch (error) {
        console.error("Error fetching quotation name:", error);
      }
    };
    fetchQuotationName();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log(newcompany_type);
      const response = await axios.put(
        `https://quotation-generator.dentalguru.software/api/invoice-data/${id}`,
        { newName, newAddress, newpaymentMode, newClient_GST_no,newClient_GST_per,newClient_Pan_no, newcompany_type }
      );
      if (response.status === 200) {
        setMessage(response.data.message);
        navigate("/invoicelist");
      } else {
        setMessage(response.data.error || "Failed to update Invoice name");
      }
    } catch (error) {
      console.error("Error updating Invoice name:", error);
      setMessage("Internal Server Error");
    }

    // Close the modal after saving
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/invoicelist");
  };

  return (  
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Invoice Name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNewName">
            <Form.Label>New Invoice Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new Invoice name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Form.Label className="mt-3">New Invoice Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new Invoice Address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <Form.Label className="mt-3">New Invoice Payment Mode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new Invoice Payment mode"
              value={newpaymentMode}
              onChange={(e) => setNewpaymentMode(e.target.value)}
            />
            {newClient_GST_no > '' && (
              <>
                <Form.Label className="mt-3">New Invoice GST_no</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new Invoice Payment mode"
                  value={newClient_GST_no}
                  onChange={(e) => setnewClient_GST_no(e.target.value)}
                />
                <Form.Label className="mt-3">New Invoice GST_per</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new Invoice Payment mode"
                  value={newClient_GST_per}
                  onChange={(e) => setnewClient_GST_per(e.target.value)}
                />
              </>
            )}

            {newClient_Pan_no > '' && (
              <>
                <Form.Label className="mt-3">New Invoice Pan_no </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new Invoice Payment mode"
                  value={newClient_Pan_no}
                  onChange={(e) => setnewClient_Pan_no(e.target.value)}
                />
              </>
            )}
            <Form.Label className="mt-3">New Invoice Company</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new Invoice Payment mode"
              value={newcompany_type}
              onChange={(e) => setNewcompany_type(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
      {message && <p>{message}</p>}
    </Modal>
  );
};

export default EditInvoiceName;
