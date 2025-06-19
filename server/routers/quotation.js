const express = require("express");
const multer = require('multer');
const router = express.Router();

// const {Register,Allregister, Login,} = require('../controllers/UserController');
const {Quotation, GetQuotation, Quotationviaid, GetServices,  deleteQuotation, updateServices, Notes, getNotes, deleteNote, addServices, deleteService, getnotes_text, UpdateQuotationName, CopyQuotationData, GetQuotationName, updateNote} = require('../controllers/UserController');
const upload = require("../controllers/fileUploadController");
const {  fetchcompanyname, company_name_header_footer, deleteCompanydata, CompanyDataUpload, updateCompanyData, getCompanydata, getcompany_name_data } = require("../controllers/Company_Data_Controller");
const { register, login } = require("../controllers/UserRegitrationlLogin");
const { createServiceList, getServicelist, deleteServicename, updateServiceList } = require("../controllers/ServicesList");
const { createInvoice, getInvoice, deleteInvoice, UpdateInvoiceName, GetInvoiceName, invoiceserviceid, deleteServiceInvoice, addServicesInvoice, updateServicesInvoice, getInvoiceiddata, getInvoiceAddress, CompanyIncoiceData, fetchcompanyinvoicename, company_name_invoice_data, CopyInvoiceData, createNote, deleteInvoiceNote, getInvoiceNotes, createInvoiceNote, InvoiceNotes, InvoicegetNotes, InvoicedeleteNote, InvoiceupdateNote, UpdateInvoice_No, UpdateInvoice_date, UpdateInvoice_start_date, UpdateInvoice_end_date, getInvoiceDate, getAllInvoice, createUpdateInvoice } = require("../controllers/InvoiceController");



// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         const imageFileName = Date.now() + '-' + file.originalname;
//         cb(null, imageFileName);
//     },
// });
// const upload = multer({ storage: storage });



router.post("/register",register);
router.post("/login",login );

router.put("/quotation/:quotationId",updateServices);
router.post("/quotation",Quotation);
router.delete("/quotation/:id",deleteQuotation);
router.post('/services/:id', addServices);
router.delete('/services/:serviceId', deleteService);
router.get("/quotation/:id",Quotationviaid);
// router.get("/quotation",GetQuotation);
router.get("/quotation-data/:UserId", GetQuotation);
router.put("/quotation-data/:quotationId", UpdateQuotationName);
router.post("/copy-quotation/:quotationId", CopyQuotationData);
router.get("/quotation-name/:quotationId", GetQuotationName);

router.get("/services",GetServices);


router.post("/notes",Notes);
router.get('/notes/:quotationId', getNotes);
router.delete('/notes/:noteId', deleteNote);
router.get("/notes_data",getnotes_text);
router.put('/notes', updateNote);







router.post('/upload-company-profile', upload.fields([{ name: 'header_img' }, { name: 'footer_img' } , {name: 'logo'},{name:'digital_sign'}]),CompanyDataUpload); //ff
router.get('/header-footer-images/company-names/:UserId',fetchcompanyname);
router.get('/company-data/:UserId',getCompanydata);//hh
router.post('/company-header-footer',company_name_header_footer);
router.post('/companydata',deleteCompanydata);
router.put('/companydata/:id',upload.fields([{ name: 'header_img' }, { name: 'footer_img' } , {name: 'logo'},{name:'digital_sign'}]),updateCompanyData); //ff
router.post('/company-name-data',getcompany_name_data); //fcf

router.post('/create-servicelist/:userId',createServiceList);
router.get('/servicelist/:userId',getServicelist);
router.delete('/servicelist/:serviceId',deleteServicename);
router.put('/servicelist',updateServiceList);

router.post('/create-invoice',createInvoice);
router.get("/invoice-data/:UserId", getInvoice);
router.delete("/invoice/:id",deleteInvoice);
router.put("/invoice-data/:invoiceId", UpdateInvoiceName);

router.put("/invoice-no/:invoiceId", UpdateInvoice_No);
router.put("/invoice-date/:invoiceId", UpdateInvoice_date);
router.put("/invoice-start-date/:invoiceId", UpdateInvoice_start_date);
router.put("/invoice-end-date/:invoiceId", UpdateInvoice_end_date);


router.get("/invoice-date/:id", getInvoiceDate);






router.get("/invoice-name/:invoiceId", GetInvoiceName);
router.get("/invoice/:id",invoiceserviceid);
router.get("/invoice-address/:id",getInvoiceAddress);
router.delete('/invoice-service/:serviceId', deleteServiceInvoice);
router.post('/add-invoice-services/:id', addServicesInvoice);
router.put("/invoice/:invoiceId",updateServicesInvoice);
router.post('/upload-invoice-profile', upload.fields([{ name: 'logo' }]),CompanyIncoiceData);
router.get('/company-invoice-names/:UserId',fetchcompanyinvoicename);
router.post('/company-invoice-data',company_name_invoice_data);
router.post("/copy-invoice/:invoiceId", CopyInvoiceData);


router.post("/invoice-notes",InvoiceNotes);
router.get('/invoice-get-notes/:invoiceId', InvoicegetNotes);
router.delete('/delete-notes/:noteId', InvoicedeleteNote);
router.put('/invoice-update-notes', InvoiceupdateNote);


router.get("/invoice-data", getAllInvoice);
router.post("/invoice-after-edit", createUpdateInvoice);




















module.exports = router;