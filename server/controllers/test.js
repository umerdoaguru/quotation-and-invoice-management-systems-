const express = require("express");
const { db } = require("../db");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
const app = express();
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();






const Quotation = (req, res) => {
  try {
  const { quotation_name, services } = req.body;
    const { user_id } = req.body; 


    if (!quotation_name || !services || services.length === 0) {
      return res.status(400).json({ error: "Quotation name and services are required" });
    }

    // Insert quotation
     const sqlQuotation = "INSERT INTO quotations_data (quotation_name, user_id) VALUES (?, ?)";
    db.query(sqlQuotation,[quotation_name, user_id], (err, resultQuotation) => {
      if (err) {
        console.error("Error inserting quotation:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Get quotation ID and name
      const quotationId = resultQuotation.insertId;
      const quotationName = quotation_name;

      // Insert services with the associated quotation_id and quotation_name
      const sqlServices = "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";
      const servicesValues = services.map((service) => [
        quotationId,
        quotationName,
        service.service_type,
        service.service_name,
        service.service_description,
        service.actual_price,
        service.offer_price,
        service.subscription_frequency,
      ]);

      db.query(sqlServices, [servicesValues], (err) => {
        if (err) {
          console.error("Error inserting services:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(200).json({
          success: true,
          message: "Quotation and services added successfully",
          quotation: {
            id: quotationId,
            quotation_name: quotationName,
          },
        });
      });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const GetQuotation = (req, res) => {
  try {
    const { UserId } = req.params; // Extracting UserId from req.params
      const sql = "SELECT * FROM quotations_data WHERE user_id = ? ORDER BY quotation_id DESC";
    db.query(sql,[UserId], (err, quotations) => {
      if (err) {
        console.error("Error querying quotations data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(quotations);
      }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetServices = (req, res) => {
  try {
    const getquery = "SELECT * FROM services";

    db.query(getquery, (error, result) => {
      if (error) {
        console.log("services not found", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const user = result;
        res.status(200).json({
          success: true,
          message: "services added successfully",
          services: user,
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

  const login = async (req, res) => {
    try {
       const {email, password} = req.body

       //Validation 
       if(!email || !password){
        return res.status(404).send({
          success: false,
          message: "Invaild email or password ",
        });
       }
       // check user in mysql 
       const checkUserQuery = "SELECT * FROM registered_data WHERE email =?";
       db.query(checkUserQuery,[email],async(err,results)=>{
        if(err){
          console.log("Error checking  user in mysql",err);
        }
        if(results.length===0){
          return res.status(404).send({
            success:false,
            message:"email is not  registered"
          })
        
        }
        const user = results[0];
      

        //compare  passwords
        const match = await bcrypt.compare(password,user.password);
        if(!match){
          return  res.status(404).send({
            success: false,
            message: "Invaild password ",
          });
          
          
        }
       
       //generate  token 
       const token = await JWT.sign({id: user.id}, process.env.JWT_SECRET,{ expiresIn: "7d"});

       res.status(200).send({
        success: true,
        message : "Login sucessfully",
        user:{
          id: user.user_id,
          name:user.user_name,
          email:user.email,
         
        },
        token,
       });
      });
      }

    catch (error) {
    console.log(error);
    res.status(500).send({success:false , message:"error in login ", error})
    }
  };

const register = (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validations
    const requiredFields = [name, email, password];

    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the "password"
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Check if the user already exists
    const checkUserQuery = "SELECT * FROM registered_data WHERE email = ?";

    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        console.error("Error checking if user exists in MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        // Check if there are any rows in the result
        if (result.length > 0) {
          return res.status(400).json({
            error: "User already exists.",
          });
        } else {
          // User not found, proceed with registration
          const insertUserQuery = `
            INSERT INTO registered_data  (
              user_name, email, password
            ) VALUES (?, ?, ?)
          `;

          const insertUserParams = [name, email, hashedPassword];

          db.query(
            insertUserQuery,
            insertUserParams,
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error("Error inserting user:", insertErr);
                res.status(500).json({ error: "Internal server error" });
              } else {
                console.log("User registered successfully");
                return res.status(200).json({
                  success: true,
                  message: "User registered successfully",
                });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};





const Quotationviaid = (req, res) => {
  try {
    const quotation_id = req.params.id;

    const getQuery = `SELECT * FROM services_data WHERE quotation_id = ?`;

    db.query(getQuery, quotation_id, (error, result) => {
      if (error) {
        console.log("Quotation not found", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateServices = (req, res) => {
  try {
    const { quotationId } = req.params;
    const { services } = req.body;

    const updateServicePromises = services.map((service) => {
   
    
     const sqlUpdateService = `
        UPDATE services_data
        SET
          service_type = ?,
          service_name = ?,
          service_description = ?,
          actual_price = ?,
          offer_price = ?,
          subscription_frequency = ?
        WHERE
          quotation_id = ? AND service_id = ?`;

      const values = [
        service.service_type,
        service.service_name,
        service.service_description,
        service.actual_price,
        service.offer_price,
        service.subscription_frequency, 
        quotationId,
        service.service_id,
      ];

      db.query(sqlUpdateService, values, (err) => {
        if (err) {
          console.error('Error updating services:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    });

    // Wait for all update queries to finish before sending the response
    Promise.all(updateServicePromises).then(() => {
      res.status(200).json({ success: true, message: 'Services updated successfully' });
    });

  } catch (error) {
    console.error('Error updating services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const deleteService = (req, res) => {
  try {
    const { serviceId } = req.params;

    // Implement logic to delete the service with the specified ID from your database
    db.query('DELETE FROM services_data WHERE service_id = ?', [serviceId], (err, result) => {
      if (err) {
        console.error('Error deleting service:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Check if a row was affected to determine if the service was found and deleted
        if (result.affectedRows > 0) {
          res.status(200).json({ success: true, message: 'Service deleted successfully' });
        } else {
          res.status(404).json({ error: 'Service not found' });
        }
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const CopyQuotationData = (req, res) => {
  const { quotationId } = req.params; // Extract quotationId from req.params

  // Retrieve the quotation data based on the provided quotation ID
  const sqlQuotation = "SELECT * FROM quotations_data WHERE quotation_id = ?";

  // Execute the query asynchronously to fetch the quotation data
  db.query(sqlQuotation, [quotationId], (err, quotationResults) => {
    if (err) {
      console.error("Error fetching quotation data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const quotation = quotationResults[0];

    // Check if the quotation data exists
    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    // Extract the quotation name
    const newQuotationName = `Copy of ${quotation.quotation_name}`;

    // Insert the copied quotation into the database
    db.query("INSERT INTO quotations_data (quotation_name, user_id) VALUES (?, ?)", [newQuotationName, quotation.user_id], (err, result) => {
      if (err) {
        console.error("Error inserting copied quotation:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const newQuotationId = result.insertId;

      // Retrieve services associated with the original quotation ID
      const sqlGetServices = "SELECT * FROM services_data WHERE quotation_id = ?";

      // Execute the query asynchronously to fetch the services data
      db.query(sqlGetServices, [quotationId], (err, servicesResults) => {
        if (err) {
          console.error("Error fetching services data:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const services = servicesResults;

        // Copy service data associated with the original quotation ID to the new quotation ID
        const sqlServices = "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";
        const servicesValues = services.map((service) => [
          newQuotationId, // Use the new quotation ID
          newQuotationName,
          service.service_type,
          service.service_name,
          service.service_description,
          service.actual_price,
          service.offer_price,
          service.subscription_frequency,
        ]);

        db.query(sqlServices, [servicesValues], (err, servicesInsertResult) => {
          if (err) {
            console.error("Error copying services data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // SQL query to retrieve notes data associated with the quotation ID
          const sqlNotes = 'SELECT * FROM notes WHERE quotation_id = ?';

          // Execute the query asynchronously and retrieve the notes data
          db.query(sqlNotes, [quotationId], (err, notesResults) => {
            if (err) {
              console.error("Error fetching notes data:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            const notes = notesResults;

            // Prepare notes data for insertion
            const notesValues = notes.map(note => [note.note_text, newQuotationId]);

            // SQL query to insert notes data into the database
            const insertNotesQuery = 'INSERT INTO notes (note_text, quotation_id) VALUES ?';

            // Execute the insertion query
            db.query(insertNotesQuery, [notesValues], (err, notesInsertResult) => {
              if (err) {
                console.error('Error inserting notes data:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
              }

              console.log('Notes data inserted successfully:', notesInsertResult);

              res.status(200).json({ message: "Quotation and services data copied successfully" });
            });
          });
        });
      });
    });
  });
};

const updateNote = (req, res) => {
  const { notes } = req.body;

  // Create an array to store promises
  const updatePromises = notes.map((note) => {
    const { id, quotation_id, note_text } = note;
    // Return the promise generated by db.query
    return db.query('UPDATE notes SET note_text = ? WHERE id = ? AND quotation_id = ?', [note_text, id, quotation_id]);
  });

  // Execute all promises concurrently
  Promise.all(updatePromises)
    .then(() => {
      // Send a success response
      res.status(200).json({ success: true, message: 'Notes updated successfully' });
    })
    .catch((error) => {
      console.error('Error updating notes:', error);
      // Send an error response
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
};




 module.exports = { Quotation,GetServices,GetQuotation,Quotationviaid,updateServices,deleteService,register,login,CopyQuotationData,updateNote};
//  module.exports = { GetServices,register,login};
