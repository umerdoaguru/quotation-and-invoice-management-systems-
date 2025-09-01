import React, { useEffect, useState } from "react";
import axios from "axios";
import DisplayCompanyData from "./Footer";
import Header from "./Header";
import Footer from "./Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import UserLogin from "./UserLogin";
import Logout from "./Logout";
import cogoToast from "cogo-toast";
import moment from "moment";

function CreateCompanyProfile() {
  const { id } = useParams();

  const [headerImage, setHeaderImage] = useState(null);
  const [footerImage, setFooterImage] = useState(null);
  const [logoImage, setlogoImage] = useState(null);
  const [companyNameBranch, setCompanyNameBranch] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountBank_Name, setAccountBank_Name] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyMoblie_no, setCompanyMoblie_no] = useState("");
  const [companyGST_no, setCompanyGST_no] = useState("");
  const [companyPan_no, setCompanyPan_no] = useState("");
  const [companyEmail_id, setCompanyEmail_id] = useState("");
 
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companydigitalsign, setCompanydigitalsign] = useState(null);
  const navigate = useNavigate();
  const UserId = useSelector((state) => state.auth.user.id);
  const [companydata, setcompanydata] = useState([]);
  
 
  useEffect(() => {
    const fetchinvoice = async () => {
      try {
        const response = await axios.get(`https://quotation-generator.dentalguru.software/api/company-data/${UserId}`);
        setcompanydata(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchinvoice();
  }, [UserId]);

  const handleDeleteCompanyData = async (CompanyName) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Company data?");
   if(isConfirmed){ try {
       const response = await axios.post('https://quotation-generator.dentalguru.software/api/companydata', {
        company_name: CompanyName
      });
       
       
       
      if (response.status === 200) {
        console.log('Company Data deleted successfully');
        // Refresh CompanyDatas after deletion
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting Company Data:', error);
    } 
  }
  };

  
  // const handleUpload = async (e) => {
    const handleHeaderImageChange = (e) => {
      setHeaderImage(e.target.files[0]);
    };
  
    const handleFooterImageChange = (e) => {
      setFooterImage(e.target.files[0]);
    };
    const handleLogoImageChange = (e) => {
      setlogoImage(e.target.files[0]);
    };
    const handledigitalSignImageChange = (e) => {
      setCompanydigitalsign(e.target.files[0]);
    };
 

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("header_img", headerImage);
      formData.append("footer_img", footerImage);

      formData.append("user_id", UserId);
      formData.append("company_name", companyNameBranch);
      formData.append("company_name_account_name", accountName);
      formData.append("company_name_account_ifsc", accountIFSC);
      formData.append("company_name_account_number", accountNumber);
      formData.append("bank", accountBank_Name);
      formData.append("company_address", companyAddress);
      formData.append("moblie_no", companyMoblie_no);
      formData.append("gst_no", companyGST_no);
      formData.append("pan_no", companyPan_no);
      formData.append("email_id", companyEmail_id);
      formData.append("logo", logoImage);
      formData.append("digital_sign", companydigitalsign);

      const response = await axios.post(
        "https://quotation-generator.dentalguru.software/api/upload-company-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success === true) {
        // Trigger CogoToast success message

        // Reset input values after successful upload
        setHeaderImage(null);
        setFooterImage(null);
        setCompanyNameBranch("");
        setAccountName("");
        setAccountIFSC("");
        setAccountNumber("");
        setCompanyAddress("");
        setAccountBank_Name("");
        setCompanyMoblie_no("");
        setCompanyGST_no("");
        setCompanyPan_no("");
        setCompanyEmail_id("");
        setlogoImage(null);
     
        setCompanydigitalsign(null);

        window.location.reload();
        cogoToast.success(`${response.data.message}`);
      } else {
        console.error(
          "Error uploading company data and images:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error uploading company data and images:", error.message);
    }
  };
  const handleEditCompany = (company) => {
    navigate(`/updatecompanydata`, { state: { company } });
  };

  const handleChangeCompany = (e) => {
    setSelectedCompany(e.target.value);
  };

  return (
    <Wrapper>
      <div className="container-fluid mt-2 mx-1 ">
        <form className="form-control" onSubmit={handleUpload}>
          <div className="d-flex justify-content-between">
            <div className="mx-3 mt-3">
              {" "}
              <UserLogin />
            </div>
            <div className=" mt-1 mx-3 ">
              {" "}
              <Logout />
            </div>
          </div>
          <div className="row g-2 mt-2">
            <div className="col-lg-3">
              <Link
                to="/quotation-form"
                className="text-white text-decoration-none btn btn-success mx-1  w-100"
              >
                Create Quotation
              </Link>
            </div>
            <div className="col-lg-3">
              <Link
                to="/create-invoice"
                className="text-white text-decoration-none btn btn-success mx-1  w-100"
              >
                Create Invoice
              </Link>
            </div>
            <div className="col-lg-3">
              <Link
                to="/quotationlist"
                className="text-white text-decoration-none btn btn-success mx-1  w-100"
              >
                Quotation List
              </Link>
            </div>
            <div className="col-lg-3">
              <Link
                to="/invoicelist"
                className="text-white text-decoration-none btn btn-success mx-1  w-100"
              >
                Invoice List
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-6">
              
            </div>
            <div className="col-lg-2"></div>
          </div>

          <div className="row">
         
            <div className="col-lg-4"></div>
            <div className="col-lg-5 mt-4"><h3 className="text-center mt-2">Create Company Profile  </h3></div>
            <div className="col-lg-3 mt-4"><Link
                to="/servicenamelist"
                className="text-white text-decoration-none btn btn-success  mb-2 mt-2 w-100 "
              >
               Service Name List
              </Link></div>
           
          
          
         
             
            <div className="col-lg-12">
              {" "}
              <div className="form-control text-center">
                <div className="">
                  <div className="row">
                    <div className="col-lg-2">
                      <label className="form-check-label ">
                        Company Name :
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={companyNameBranch}
                          onChange={(e) => setCompanyNameBranch(e.target.value)}
                          placeholder="Enter the Company Name "
                          required
                        />
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label className="form-check-label ">
                        Company Address :
                        <input
                          type="text"
                          className="form-control mb-2 mx-2"
                          value={companyAddress}
                          onChange={(e) => setCompanyAddress(e.target.value)}
                          placeholder="Enter the Company Address "
                          required
                        />
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label className="form-check-label ">
                        Company Mobile Number :
                        <input
                          type="text"
                          className="form-control mb-2 mx-2"
                          value={companyMoblie_no}
                          onChange={(e) => setCompanyMoblie_no(e.target.value)}
                          placeholder="Enter the Mobile Number  "
                          required
                        />
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label className="form-check-label ">
                        Company Email Id :
                        <input
                          type="email"
                          className="form-control mb-2 mx-2"
                          value={companyEmail_id}
                          onChange={(e) => setCompanyEmail_id(e.target.value)}
                          placeholder="Enter the Email Id  "
                          required
                        />
                      </label>
                    </div>
                    <div className="col-lg-2">
                    <label className="form-check-label">
                    Select Company Details
                      <select
                          className="form-select "
                          id="companyList"
                          name="company_list"
                          onChange={handleChangeCompany}
                          value={selectedCompany}
                          required
                     
                      >
                         <option value="" disabled  >
            Select  Details
          </option>
          <option value="GST">GST</option>
                        <option value="Pan Card">
                          Pan Card 
                        </option>
                        <option value="null" >
            No Deatil
          </option>
                      </select>
                    </label>
                    </div>
                    {selectedCompany === "GST" && (  
                      <>
                          <div className="col-lg-2">
                      <label className="form-check-label ">
                        GST Number :
                        <input
                          type="text"
                          className="form-control mb-2 mx-2"
                          value={companyGST_no}
                          onChange={(e) => setCompanyGST_no(e.target.value)}
                          placeholder="Enter the Company Gst No. "
                          maxLength={15}
                        />
                      </label>
                    </div>
                    {/* <div className="col-lg-2">
                      <label className="form-check-label ">
                        Company Charges Gst % : (Optional)
                        <input
                          type="text"
                          className="form-control mb-2 mx-2"
                          value={companyGST_PER}
           
                          onChange={(e) => setCompanyGST_PER(e.target.value)}
                          placeholder="Enter the Company Gst Charges "
                        />
                      </label>
                    </div> */}
                      </>
                

                    )}
  {selectedCompany === "Pan Card" && (
    <div className="col-lg-2">
                      <label className="form-check-label ">
                        Pan Number : 
                        <input
                          type="text"
                          className="form-control mb-2 mx-2"
                          value={companyPan_no}
                          onChange={(e) => setCompanyPan_no(e.target.value)}
                          placeholder="Enter the Company Pan No. "
                          maxLength={10}
                        />
                      </label>
                    </div>

  )}
                  </div>
                </div>

                <div className=" mt-3">
                  <h6>Company Name Payment Detail :-</h6>
                  <div className="row">
                    <div className="col-lg-2">
                      <label className="form-check-label">
                        Account Name :
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          placeholder="Enter the Account No. "
                          required
                        />
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label className="form-check-label mx-lg-2  ">
                        IFSC Code :
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={accountIFSC}
                          onChange={(e) => setAccountIFSC(e.target.value)}
                          placeholder="Enter the IFSC Number "
                          required
                        />
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label className="form-check-label ">
                        Account Number :
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="Enter the Account Number "
                          required
                        />
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label className="form-check-label ">
                        Bank Name :
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={accountBank_Name}
                          onChange={(e) => setAccountBank_Name(e.target.value)}
                          placeholder="Enter the Bank Name "
                          required
                        />
                      </label>
                    </div>
                
                  <div className="col-lg-2">
                    <label className="form-check-label">
                      Header Image :
                      <input
                        type="file"
                        className="form-control  mb-2"
                        accept="image/*"
                        onChange={handleHeaderImageChange}
                        required
                      />
                      <span className="mx-2">
                        2480px width and 3508px height of Header
                      </span>
                    </label>
                  </div>
                  <div className="col-lg-2">
                    <label className="form-check-label mx-2">
                      Footer Image :
                      <input
                        type="file"
                        className="form-control mb-2"
                        accept="image/*"
                        onChange={handleFooterImageChange}
                        required
                      />
                      <span className="mx-2">
                        2480px width and 3508px height of Footer
                      </span>
                    </label>
                  </div>
                  <div className="col-lg-2">
                    <label className="form-check-label mx-2">
                      Logo Image :
                      <input
                        type="file"
                        className="form-control mb-2"
                        accept="image/*"
                        onChange={handleLogoImageChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="col-lg-2">
                    <label className="form-check-label mx-2">
                      Digital Singnature Image :
                      <input
                        type="file"
                        className="form-control mb-2"
                        accept="image/*"
                        onChange={handledigitalSignImageChange}
                        required
                      />
                    </label>
                  </div>
                </div>


                <button className="btn btn-success " type="sumbit">
                  Upload Company Profile
                </button>
              </div>
            </div>
            </div>
                </div>
                

          
        </form>
      </div>

      <div className="container mt-4">
      <h2>List of Company Profile Created Data</h2>
      <div className="" style={{ maxHeight: "700px", overflowY: "auto" }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Company Name</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companydata.map((data, index) => (
              <tr key={data.id}>
                <td>{index + 1}</td>  
                <td>{data.company_name}</td>
                
                <td>{moment(data.created_date).format('DD/MM/YYYY')}</td>
                <td>
           
                      <button className="btn btn-success mx-3 " onClick={() => handleEditCompany(data.company_name)}>
              Edit 
            </button>
                <button className="btn btn-danger mx-sm-0 mx-lg-2 m-1" onClick={() => handleDeleteCompanyData(data.company_name)}>Delete</button>

              
              
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
    </div>
     
    </Wrapper>
  );
}

export default CreateCompanyProfile;

const Wrapper = styled.div`
  img {
    width: -webkit-fill-available;
  }
`;
