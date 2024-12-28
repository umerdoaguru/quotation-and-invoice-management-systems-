
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const DeleteNotes = () => {
  const { id } = useParams();
 
  const [notes, setNotes] = useState([]);

 

  const handleDeleteNote = async (noteId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Notes?");
   if(isConfirmed){ try {
      const response = await axios.delete(`https://quotation.queuemanagementsystemdg.com/api/notes/${noteId}`);

      if (response.status === 200) {
        console.log('Note deleted successfully');
        // Refresh notes after deletion
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    } 
  }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`https://quotation.queuemanagementsystemdg.com/api/notes/${id}`);

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Delete Notes </h1>
      <ul className="list-group">
        {notes.map((note) => (
          <li key={note.id} className='list-group-item'>
            {note.note_text}
          
            <button className="btn btn-danger mx-3 float-end" onClick={() => handleDeleteNote(note.id)}>
              Delete Note
            </button>
          </li>
        ))}
      </ul>
      <br />
      <Link to={`/final-quotation/${id}`} className="btn btn-primary">
        Back to Final Quotation
      </Link>
    </div>
  );
};

export default DeleteNotes;