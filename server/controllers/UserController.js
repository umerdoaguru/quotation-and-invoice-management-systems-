const express = require("express");
const { db } = require("../db");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const app = express();
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();






// const Quotation = async (req, res) => {
//   try {
//     const {
//       quotation_name,
//       services, // an array of services
//     } = req.body;

//     if (!quotation_name || !services || services.length === 0) {
//       return res.status(400).json({ error: "Quotation name and services are required" });
//     }

//     // Insert quotation
//     const sqlQuotation = "INSERT INTO quotations_data (quotation_name) VALUES (?)";
//     const resultQuotation = await new Promise((resolve, reject) => {
//       db.query(sqlQuotation, [quotation_name], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     // Get quotation ID and name
//     const quotationId = resultQuotation.insertId;
//     const quotationName = quotation_name;

//     // Insert services with the associated quotation_id and quotation_name
//     const sqlServices ="INSERT INTO services_data (quotation_id, quotation_name, service_type, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";
//     const servicesValues = services.map((service) => [
//       quotationId,
//       quotationName,
//       service.service_type,
//       service.service_description,
//       service.actual_price,
//       service.offer_price,
//       service.subscription_frequency, 
//     ]);

//     await new Promise((resolve, reject) => {
//       db.query(sqlServices, [servicesValues], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     res.status(200).json({
//       success: true,
//       message: "Quotation and services added successfully",
//       quotation: {
//         id: quotationId,
//         quotation_name: quotationName,
//       },
//     });

//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const Quotation = async (req, res) => {
  try {
    const { quotation_name, services } = req.body;
    const { user_id } = req.body; // Assuming user_id is retrieved from the authenticated user

    if (!quotation_name || !services || services.length === 0) {
      return res.status(400).json({ error: "Quotation name and services are required" });
    }

    // Insert quotation with user_id
    const sqlQuotation = "INSERT INTO quotations_data (quotation_name, user_id) VALUES (?, ?)";
    const resultQuotation = await new Promise((resolve, reject) => {
      db.query(sqlQuotation, [quotation_name, user_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

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

    await new Promise((resolve, reject) => {
      db.query(sqlServices, [servicesValues], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({
      success: true,
      message: "Quotation and services added successfully",
      quotation: {
        id: quotationId,
        quotation_name: quotationName,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};








const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    // Begin a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Delete notes associated with the quotation
    const sqlDeleteNotes = "DELETE FROM notes WHERE quotation_id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteNotes, [id], (err, result) => {
        if (err) {
          // Rollback the transaction if an error occurs
          db.rollback(() => reject(err));
        } else {
          resolve(result);
        }
      });
    });

    // Delete services associated with the quotation
    const sqlDeleteServices = "DELETE FROM services_data WHERE quotation_id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteServices, [id], (err, result) => {
        if (err) {
          // Rollback the transaction if an error occurs
          db.rollback(() => reject(err));
        } else {
          resolve(result);
        }
      });
    });

    // Delete the quotation itself
    const sqlDeleteQuotation = "DELETE FROM quotations_data WHERE quotation_id = ?";
    await new Promise((resolve, reject) => {
      db.query(sqlDeleteQuotation, [id], (err, result) => {
        if (err) {
          // Rollback the transaction if an error occurs
          db.rollback(() => reject(err));
        } else {
          resolve(result);
        }
      });
    });

    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          // Rollback the transaction if an error occurs during commit
          db.rollback(() => reject(err));
        } else {
          resolve();
        }
      });
    });

    res.status(200).json({
      success: true,
      message: "Quotation, associated notes, and services deleted successfully",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





// const GetQuotation = async (req, res) => {
//   try {
//     const sql = "SELECT * FROM quotations_data ORDER BY quotation_id DESC";

//     const quotations = await new Promise((resolve, reject) => {
//       db.query(sql, (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       });
//     });

//     res.status(200).json(quotations);
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

  const GetQuotation = async (req, res) => {
    try {
      const { UserId } = req.params; // Extracting UserId from req.params
      const sql = "SELECT * FROM quotations_data WHERE user_id = ? ORDER BY quotation_id DESC";

      const quotations = await new Promise((resolve, reject) => {
        db.query(sql, [UserId], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      res.status(200).json(quotations);
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


 const  GetQuotationName = async (req, res) => {
  try {
    const { quotationId } = req.params; // Extracting UserId from req.params
    const sql = "SELECT * FROM quotations_data WHERE quotation_id = ? ";

    const quotations = await new Promise((resolve, reject) => {
      db.query(sql, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(quotations);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


  const UpdateQuotationName = async (req, res) => {
    try {
        const { quotationId } = req.params; // Extracting quotationId from req.params
        const { newName } = req.body; // Extracting new quotation name from req.body

        // Construct SQL query to update the quotation name
        const sql = "UPDATE quotations_data SET quotation_name = ? WHERE quotation_id = ?";

        // Execute the update query asynchronously
        await new Promise((resolve, reject) => {
            db.query(sql, [newName, quotationId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        const sql2 = "UPDATE services_data SET quotation_name = ? WHERE quotation_id = ?";

        // Execute the update query asynchronously
        await new Promise((resolve, reject) => {
            db.query(sql2, [newName, quotationId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        res.status(200).json({ message: "Quotation name updated successfully" });
    } catch (error) {
        console.error("Error updating quotation name:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};








const CopyQuotationData = async (req, res) => {
  try {
    const { quotationId } = req.params; // Extract quotationId from req.params
  
    // Retrieve the quotation data based on the provided quotation ID
    const sqlQuotation = "SELECT * FROM quotations_data WHERE quotation_id = ?";
  
    // Execute the query asynchronously to fetch the quotation data
    const [quotation] = await new Promise((resolve, reject) => {
      db.query(sqlQuotation, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    
    // Check if the quotation data exists
    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    // Extract the quotation name
    const newQuotationName = `Copy of ${quotation.quotation_name}`;

    // Insert the copied quotation into the database
    const result = await db.query("INSERT INTO quotations_data (quotation_name, user_id) VALUES (?, ?)", [newQuotationName, quotation.user_id]);


    const sqlgetId = "SELECT * FROM quotations_data WHERE quotation_name = ?";
    const [getId] = await new Promise((resolve, reject) => {
      db.query(sqlgetId, [newQuotationName], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    const newQuotationId = getId.quotation_id
    


    
    // Retrieve services associated with the original quotation ID
    const sqlGetServices = "SELECT * FROM services_data WHERE quotation_id = ?";
  
    // Execute the query asynchronously to fetch the services data
    const services = await new Promise((resolve, reject) => {
      db.query(sqlGetServices, [quotationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

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

    await new Promise((resolve, reject) => {
      db.query(sqlServices, [servicesValues], (err, result) => {
        if (err) {
          console.error("Error copying services data:", err); // Log the error
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

 
    // SQL query to retrieve notes data associated with the quotation ID
const sqlNotes = 'SELECT * FROM notes WHERE quotation_id = ?';

// Execute the query asynchronously and retrieve the notes data
const getNotes = await new Promise((resolve, reject) => {
  db.query(sqlNotes, [quotationId], (err, results) => {
    if (err) {
      reject(err);
    } else {
      resolve(results);
    }
  });
});

// Check if notes data is retrieved successfully
if (!Array.isArray(getNotes)) {
  console.error('Error fetching notes data:', getNotes);
  // Handle the error appropriately, such as returning an error response
} else {
  // Prepare notes data for insertion
  const notesValues = getNotes.map(note => [note.note_text, newQuotationId]);

  // SQL query to insert notes data into the database
  const insertNotesQuery = 'INSERT INTO notes (note_text, quotation_id) VALUES ?';

  // Execute the insertion query
  db.query(insertNotesQuery, [notesValues], (err, result) => {
    if (err) {
      console.error('Error inserting notes data:', err);
      // Handle the error appropriately, such as returning an error response
    } else {
      console.log('Notes data inserted successfully:', result);
      // Handle the successful insertion, such as returning a success response
    }
  });
}


   
    
    res.status(200).json({ message: "Quotation and services data copied successfully" });
  } catch (error) {
    console.error("Error copying quotation and services data:", error);
    res.status(500).json({ error: "Internal Server Error" });
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



// const addServices = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { quotation_name, services } = req.body;

//     if (!id || !quotation_name || !services || services.length === 0) {
//       return res.status(400).json({ error: 'Quotation ID, name, and services are required' });
//     }

//     const servicesValues = services.map((service) => [
//       id,
//       quotation_name,
//       service.service_type,
//       service.service_name,
//       service.service_description,
//       service.actual_price,
//       service.offer_price, 
//      service.subscription_frequency, 
//     ]);

//     const sql = "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";

//     await new Promise((resolve, reject) => {
//       db.query(sql, [servicesValues], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     res.status(201).json({ success: true, message: 'Services added successfully' });
//   } catch (error) {
//     console.error('Error adding services:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const addServices = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotation_name, services } = req.body;

    if (!id || !quotation_name || !services || services.length === 0) {
      return res.status(400).json({ error: 'Quotation ID, name, and services are required' });
    }

    const servicesValues = services.map((service) => [
      id,
      quotation_name,
      service.service_type,
      service.service_name,
      service.service_description,
      service.actual_price,
      service.offer_price, 
     service.subscription_frequency, 
    ]);

    const sql = "INSERT INTO services_data (quotation_id, quotation_name, service_type, service_name, service_description, actual_price, offer_price, subscription_frequency) VALUES ?";

    await new Promise((resolve, reject) => {
      db.query(sql, [servicesValues], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(201).json({ success: true, message: 'Services added successfully' });
  } catch (error) {
    console.error('Error adding services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Implement logic to delete the service with the specified ID from your database
    const result = await new Promise((resolve, reject) => {
      db.query('DELETE FROM services_data WHERE service_id = ?', [serviceId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Check if a row was affected to determine if the service was found and deleted
    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: 'Service deleted successfully' });
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

// const updateServices = async (req, res) => {
//   try {
//     const { quotationId } = req.params;
//     const { services } = req.body;

 
//     for (const service of services) {
//       const sqlUpdateService = `
//         UPDATE services_data
//         SET
//           service_type = ?,
//           service_description = ?,
//           actual_price = ?,
//           offer_price = ?
//         WHERE
//           quotation_id = ? AND service_id = ?`;

//       const values = [
//         service.service_type,
//         service.service_description,
//         service.actual_price,
//         service.offer_price,
//         quotationId,
//         service.service_id,
//       ];

//       await db.query(sqlUpdateService, values);
//     }

//     res.status(200).json({ success: true, message: 'Services updated successfully' });
//   } catch (error) {
//     console.error('Error updating services:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const updateServices = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const { services } = req.body;

    const updateServicePromises = services.map(async (service) => {
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

      await db.query(sqlUpdateService, values);
    });

    await Promise.all(updateServicePromises);

    res.status(200).json({ success: true, message: 'Services updated successfully' });
  } catch (error) {
    console.error('Error updating services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const Notes = (req, res) => {
  const { noteTexts, quotationId } = req.body;

  // Assuming noteTexts is an array of strings
  const values = noteTexts.map((text) => [text, quotationId]);

  const sql = 'INSERT INTO notes (note_text, quotation_id) VALUES ?';

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error inserting notes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ ids: result.insertId });
    }
  });
};


const getNotes = (req, res) => {
  const { quotationId } = req.params;

  // Assuming you have a 'notes' table in your database
  const sql = 'SELECT * FROM notes WHERE quotation_id = ?';

  db.query(sql, [quotationId], (err, result) => {
    if (err) {
      console.error('Error fetching notes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(result);
    }
  });
};

const deleteNote = (req, res) => {
  const noteId = req.params.noteId;

  const sql = 'DELETE FROM notes WHERE id = ?';

  db.query(sql, [noteId], (err, result) => {
    if (err) {
      console.error('Error deleting note:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Note deleted successfully' });
    }
  });
};
const updateNote = async (req, res) => {
  const { notes } = req.body;

  try {
    // Use map to update each note in the database
    await Promise.all(notes.map(async (note) => {
      const { id, quotation_id, note_text } = note;
      // Execute the update query for each note
      await db.query('UPDATE notes SET note_text = ? WHERE id = ? AND quotation_id = ?', [note_text, id, quotation_id]);
    }));
    // Send a success response
    res.status(200).json({ success: true, message: 'Notes updated successfully' });
  } catch (error) {
    console.error('Error updating notes:', error);
    // Send an error response
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


const getnotes_text = (req, res) => {
  const sql = 'SELECT notes_text FROM notes_data';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching notes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const notes = result.map((row) => row.notes_text);
      res.json(notes);
    }
  });
};








module.exports = { Quotation, GetQuotation, Quotationviaid,addServices,deleteService, GetServices,deleteQuotation,updateServices,Notes,getNotes,
  getnotes_text,
  deleteNote , UpdateQuotationName,CopyQuotationData ,GetQuotationName,updateNote};

