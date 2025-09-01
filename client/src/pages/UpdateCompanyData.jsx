import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
function UpdateCompanyData({ companyId }) {
  const { id } = useParams();
  const navigate = useNavigate()
  const [headerImage, setHeaderImage] = useState(null);
  const [footerImage, setFooterImage] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountIFSC, setAccountIFSC] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [accountBank_Name, setAccountBank_Name] = useState("");

  const [companyMoblie_no, setCompanyMoblie_no] = useState("");

  const [companyGST_no, setCompanyGST_no] = useState("");
  const [companyGST_per, setCompanyGST_per] = useState("");
  const [companyPan_no, setCompanyPan_no] = useState("");

  const [companyEmail_id, setCompanyEmail_id] = useState("");
  const [logoImage, setLogoImage] = useState(null);

  const [companydigitalsign, setCompanydigitalsign] = useState(null);
  const [idcompany, setIdCompany] = useState('');
  const [userId, setUserId] = useState('');
  const [selectedFileHeader, setSelectedFileHeader] = useState(false);
  const [selectedFileFooter, setSelectedFileFooter] = useState(false);
  const [selectedFileLogo, setSelectedFileLogo] = useState(false);
  const [selectedFileSign, setSelectedFileSign] = useState(false);
  const [showModal, setShowModal] = useState(true);
  


  const location = useLocation();
  const { company } = location.state;
  console.log(company)  ;

  useEffect(() => {
    // Fetch existing data from the API
    const fetchCompanyData = async () => {
      try {
        const response = await axios.post('https://quotation-generator.dentalguru.software/api/company-header-footer', {
          company_name: company
        });
        
        if (response.status === 200) {
          const companyData = response.data;
        

        // Set input field values with the fetched data
        setIdCompany(companyData.id)
        setUserId(companyData.user_id)
        setCompanyName(companyData.company_name);
        setAccountName(companyData.company_name_account_name);
        setAccountIFSC(companyData.company_name_account_ifsc);
        setAccountNumber(companyData.company_name_account_number);
        setCompanyAddress(companyData.company_address);
        setAccountBank_Name(companyData.bank);
        setCompanyMoblie_no(companyData.moblie_no);
        setCompanyGST_no(companyData.gst_no);
        setCompanyGST_per(companyData.gst_per);
        setCompanyPan_no(companyData.pan_no);
        setCompanyEmail_id(companyData.email_id);
        

       
        

     
        } else {
          console.error('Error Company Data:', response.statusText);
        }
       
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  },[company] );


  const handleHeaderImageChange = (e) => {
    setHeaderImage(e.target.files[0]);
    setSelectedFileHeader(true);
  };

  const handleFooterImageChange = (e) => {
    setFooterImage(e.target.files[0]);
    setSelectedFileFooter(true);
  };
  const handleLogoImageChange = (e) => {
    setLogoImage(e.target.files[0]);
    setSelectedFileLogo(true);
  };
  const handleDigitalsignImageChange = (e) => {
    setCompanydigitalsign(e.target.files[0]);
    setSelectedFileSign(true);
  };

  const handleUpload = async (e) => {
   
    try {
      if (!selectedFileHeader) {
        // Handle the case where no file is selected
        
        alert('No file selected Header');
        return;
      }
      if (!selectedFileFooter) {

        
        alert('No file selected Footer');
        return;
      }
      if (!selectedFileLogo) {

        
        alert('No file selected Logo');
        return;
      }
      if (!selectedFileSign) {

        
        alert('No file selected Signature');
        return;
      }
      const formData = new FormData();
      formData.append('header_img', headerImage);
      formData.append('footer_img', footerImage);
      formData.append('user_id', userId);
      formData.append('company_name', companyName);
      formData.append('company_name_account_name', accountName);
      formData.append('company_name_account_ifsc', accountIFSC);
      formData.append('company_name_account_number', accountNumber);
      formData.append('company_address', companyAddress);
      formData.append('bank',accountBank_Name);
      formData.append("moblie_no", companyMoblie_no);
      formData.append("gst_no", companyGST_no);
      formData.append("gst_per", companyGST_per);
      formData.append("pan_no", companyPan_no);
      formData.append("email_id", companyEmail_id);
      formData.append("logo", logoImage);
     
      formData.append('digital_sign', companydigitalsign);
     
      

   

      const response = await axios.put(`https://quotation-generator.dentalguru.software/api/companydata/${idcompany}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      

      if (response.status === 200) {
        console.log('Header and footer images updated successfully');
        // Add any additional logic here after successful update
      navigate(`/`)
      } else {
        console.error('Error updating header and footer images:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating header and footer images:', error.message);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/');
};
  return (
    <>
     
    

    
 

        
    <>
    
     <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Invoice Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
        <Row className="mb-3 g-3" >
          <Form.Group controlId="companyName" >
            <Form.Label>Company Name</Form.Label>
            <Form.Control type="text" placeholder="Enter company name" name="companyName"  value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="companyAddress">
            <Form.Label>Company Address</Form.Label>
            <Form.Control type="text" placeholder="Enter company address" name="companyAddress" value={companyAddress}   onChange={(e) => setCompanyAddress(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="companyMobileNumber">
            <Form.Label>Company Mobile Number</Form.Label>
            <Form.Control type="text" placeholder="Enter company mobile number" name="companyMobileNumber" value={companyMoblie_no}   onChange={(e) => setCompanyMoblie_no(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="companyEmailId">
            <Form.Label>Company Email Id</Form.Label>
            <Form.Control type="email" placeholder="Enter company email" name="companyEmailId" value={companyEmail_id}   onChange={(e) => setCompanyEmail_id(e.target.value)}/>
          </Form.Group>

         
          {companyGST_no > '' && (  
          <Form.Group controlId="companyGstPanNumber">
            <Form.Label>GST Number</Form.Label>
            <Form.Control type="text" placeholder="Enter GST number" name="companyGstNumber" value={companyGST_no}  onChange={(e) => setCompanyGST_no(e.target.value)} />
          </Form.Group>
          )}
          {companyGST_per > '' && (  
          <Form.Group controlId="companyGst%">
            <Form.Label>GST %</Form.Label>
            <Form.Control type="text" placeholder="Enter GST %" name="companyGst%" value={companyGST_per}  onChange={(e) => setCompanyGST_per(e.target.value)} />
          </Form.Group>
          )}

{companyPan_no > '' && (  
          <Form.Group controlId="companyGstPanNumber">
            <Form.Label>PAN Number</Form.Label>
            <Form.Control type="text" placeholder="Enter PAN number" name="companyPanNumber" value={companyPan_no}  onChange={(e) => setCompanyPan_no(e.target.value)} />
          </Form.Group>
)}

         
        </Row>

        <Row className="mb-3 g-2">
          <Form.Group controlId="accountName">
            <Form.Label>Account Name</Form.Label>
            <Form.Control type="text" placeholder="Enter account name" name="accountName" value={accountName}   onChange={(e) => setAccountName(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="accountIFSC">
            <Form.Label>IFSC Code</Form.Label>
            <Form.Control type="text" placeholder="Enter IFSC code" name="accountIFSC" value={accountIFSC}   onChange={(e) =>  setAccountIFSC(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="accountNumber">
            <Form.Label>Account Number</Form.Label>
            <Form.Control type="text" placeholder="Enter account number" name="accountNumber" value={accountNumber}   onChange={(e) => setAccountNumber(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="bankName">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control type="text" placeholder="Enter bank name" name="bankName" value={accountBank_Name}   onChange={(e) => setAccountBank_Name(e.target.value)} />
          </Form.Group>
        </Row>

        <Row className="mb-3 g-2">
          <Form.Group controlId="headerImage">
            <Form.Label>Header Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleHeaderImageChange}/>
          </Form.Group>

          <Form.Group controlId="footerImage">
            <Form.Label>Footer Image</Form.Label>
            <Form.Control type="file" accept="image/*"  onChange={handleFooterImageChange} />
          </Form.Group>

          <Form.Group controlId="logoImage">
            <Form.Label>Logo Image</Form.Label>
            <Form.Control type="file" accept="image/*"  onChange={handleLogoImageChange} />
          </Form.Group>

          <Form.Group controlId="digitalSignImage">
            <Form.Label>Digital Signature Image</Form.Label>
            <Form.Control type="file" accept="image/*"  onChange={handleDigitalsignImageChange}/>
          </Form.Group>
        </Row>

        <Button variant="primary" onClick={handleUpload}>Update Company Data</Button>
      </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
           
        </Modal>
    </>

   
          
    </>
   
    
  );
}

export default UpdateCompanyData;

