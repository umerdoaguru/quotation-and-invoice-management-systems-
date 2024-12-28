const express = require('express');
const dotenv = require('dotenv');
const  cors = require('cors');
const path = require('path');

dotenv.config();

const Router = require("./routers/quotation")

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api',Router)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
