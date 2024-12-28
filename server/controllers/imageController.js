// imageController.js
const { db } = require('../db');
const path = require('path');






// const uploadImage = async (req, res) => {
//   try {
//     const { quotationId, imageType } = req.params;
//     const { file } = req;

//     // Ensure the quotation exists before adding the image
//     const checkQuotation = await new Promise((resolve, reject) => {
//       db.query('SELECT * FROM quotations_data WHERE quotation_id = ?', [quotationId], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     if (checkQuotation.length === 0) {
//       return res.status(404).json({ error: 'Quotation not found' });
//     }

//     // Insert image data into the database
//     const insertImage = await new Promise((resolve, reject) => {
//       const sql = 'INSERT INTO quotation_images (quotation_id, image_type, file_path) VALUES (?, ?, ?)';
//       const values = [quotationId, imageType, file.path];

//       db.query(sql, values, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     res.status(201).json({ success: true, message: 'Image uploaded successfully' });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const uploadImage = async (req, res) => {
    try {
      const { quotationId, imageType } = req.params;
      const { file } = req;
  
      // Ensure the quotation exists before adding the image
      const checkQuotation = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM quotations_data WHERE quotation_id = ?', [quotationId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  
      if (checkQuotation.length === 0) {
        return res.status(404).json({ error: 'Quotation not found' });
      }
  
      // Construct the image path relative to the 'uploads' directory
      const imagePath = 'https://quotation.queuemanagementsystemdg.com/uploads/' + file.filename;
  
      // Insert image data into the database
      const insertImage = await new Promise((resolve, reject) => {
        const sql = 'INSERT INTO quotation_images (quotation_id, image_type, file_path) VALUES (?, ?, ?)';
        const values = [quotationId, imageType, imagePath];
  
        db.query(sql, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  
      res.status(201).json({ success: true, message: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  const getHeaderImage = async (req, res) => {
    try {
      const { quotationId } = req.params;
  
      // Fetch header image data from the database
      const headerImageData = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM quotation_images WHERE quotation_id = ? AND image_type = "header"', [quotationId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  
      // Send the header image data as a JSON response
      res.json(headerImageData);
    } catch (error) {
      // Handle errors and send an error response
      console.error('Error fetching header image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const getFooterImage = async (req, res) => {
  try {
    const { quotationId } = req.params;

    // Fetch footer image data from the database
    const footerImageData = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM quotation_images WHERE quotation_id = ? AND image_type = "footer"', [quotationId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Send the footer image data as a JSON response
    res.json(footerImageData);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error fetching footer image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteHeaderImage = async (req, res) => {
  try {
    const { quotationId } = req.params;

    // Perform a delete operation on the database to remove the header image record
    const deleteResult = await new Promise((resolve, reject) => {
      db.query('DELETE FROM quotation_images WHERE quotation_id = ? AND image_type = "header"', [quotationId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Check if any rows were affected by the delete operation
    if (deleteResult.affectedRows > 0) {
      res.status(200).json({ message: 'Header image deleted successfully' });
    } else {
      // If no rows were affected, the header image may not exist
      res.status(404).json({ error: 'Header image not found' });
    }
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error deleting header image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteFooterImage = async (req, res) => {
  try {
    const { quotationId } = req.params;

    // Perform a delete operation on the database to remove the header image record
    const deleteResult = await new Promise((resolve, reject) => {
      db.query('DELETE FROM quotation_images WHERE quotation_id = ? AND image_type = "footer"', [quotationId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Check if any rows were affected by the delete operation
    if (deleteResult.affectedRows > 0) {
      res.status(200).json({ message: 'Footer image deleted successfully' });
    } else {
      // If no rows were affected, the header image may not exist
      res.status(404).json({ error: 'Footer image not found' });
    }
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error deleting footer image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateHeaderImage = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const { file } = req;

    // Ensure the quotation exists before updating the header image
    const checkQuotation = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM quotations_data WHERE quotation_id = ?', [quotationId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (checkQuotation.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    // Construct the new image path relative to the 'uploads' directory
    const newImagePath = 'https://quotation.queuemanagementsystemdg.com/uploads/' + file.filename;

    // Update the header image data in the database
    const updateHeaderImage = await new Promise((resolve, reject) => {
      const sql = 'UPDATE quotation_images SET file_path = ? WHERE quotation_id = ? AND image_type = "header"';
      const values = [newImagePath, quotationId];

      db.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ success: true, message: 'Header image updated successfully', newImagePath });
  } catch (error) {
    console.error('Error updating header image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateFooterImage = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const { file } = req;

    // Ensure the quotation exists before updating the header image
    const checkQuotation = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM quotations_data WHERE quotation_id = ?', [quotationId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (checkQuotation.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    // Construct the new image path relative to the 'uploads' directory
    const newImagePath = 'https://quotation.queuemanagementsystemdg.com/uploads/' + file.filename;

    // Update the header image data in the database
    const updateHeaderImage = await new Promise((resolve, reject) => {
      const sql = 'UPDATE quotation_images SET file_path = ? WHERE quotation_id = ? AND image_type = "footer"';
      const values = [newImagePath, quotationId];

      db.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ success: true, message: 'Header image updated successfully', newImagePath });
  } catch (error) {
    console.error('Error updating header image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






  




  
  

module.exports = { uploadImage,getHeaderImage,getFooterImage,deleteHeaderImage ,deleteFooterImage,updateHeaderImage,updateFooterImage};
