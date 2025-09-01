

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const CreateNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noteTexts, setNoteTexts] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Fetch notes from the backend API
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`https://quotation-generator.dentalguru.software/api/notes_data`);
        setNoteTexts(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  const handleNoteSelection = (e) => {
    const selectedNote = e.target.value;
    setNewNote(""); // Reset the new note input when selecting an existing note
    setSelectedNotes([...selectedNotes, selectedNote]);
  };

  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      setSelectedNotes([...selectedNotes, newNote]);
      setNewNote("");
    }
  };

  const handleRemoveNote = (index) => {
    const updatedNotes = [...selectedNotes];
    updatedNotes.splice(index, 1);
    setSelectedNotes(updatedNotes);
  };

  const handleCreateNotes = async () => {
    try {
      
      for (const note of selectedNotes) {
        const response = await axios.post("https://quotation-generator.dentalguru.software/api/notes", {
          noteTexts: [note],
          quotationId: id,
        });

       
        console.log("Note stored successfully:", response.data);
      }
      navigate(`/final-quotation/${id}`);
      
    } catch (error) {
      console.error("Error storing notes:", error);
    }
  };
  
  function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset the height to auto first
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height based on scrollHeight
    textarea.style.overflow = 'hidden'; // is se overflow hide kr diya 
  }

  return (
    <div className="container mt-5">
      <h2>Create New Notes</h2>

   
      <select
        className="form-select mb-3"
        value=""
        onChange={handleNoteSelection}
      >
        <option value="" disabled>Select an existing note</option>
        {noteTexts.map((text, index) => (
          <option key={index} value={text}>
            {text}
          </option>
        ))}
      </select>

    
      <div className="mb-3">
        <textarea
        
          className="form-control"
          placeholder="Enter a new note"
          spellCheck='true'
          rows="3"
          cols="90"
          value={newNote}
          onChange={(e) => {setNewNote(e.target.value);
            autoResize(e.target);
          }

          }

        />
        <button className="btn btn-primary mt-2" onClick={handleAddNote}>
          Add Note
        </button>
      </div>

      
      {selectedNotes.length > 0 && (
        <div className="mb-3">
          <h5>Selected Notes:</h5>
          <ul>
  {selectedNotes.map((note, index) => (
    <li key={index}>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{note}</pre>
      <button
        className="btn btn-danger btn-sm ms-2"
        onClick={() => handleRemoveNote(index)}
      >
        Remove
      </button>
    </li>
  ))}
</ul>


        </div>
      )}

     
      <button className="btn btn-success" onClick={handleCreateNotes}>
        Done 
      </button>

      
      <Link to={`/final-quotation/${id}`} className="btn btn-primary mx-4">
      <i className="bi bi-arrow-return-left mx-1"></i>  Back 
      </Link>
    </div>
  );
};

export default CreateNotes;
