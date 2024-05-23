import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import CsvDownloadButton from 'react-json-to-csv';

const Nurses = () => {
  const [nurses, setNurses] = useState([]);
  const [nurse, setNurse] = useState({
    name: "",
    license_number: "",
    dob: "",
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAllNurses = async () => {
      try {
        const res = await axios.get("http://localhost:8800/nurses");
        setNurses(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllNurses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/nurses/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };


  const handleChange = (e) => {
    setNurse((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // When a new nurse is added, run post command

  const handleAddClick = async (e) => {
    e.preventDefault();
    try {
      const age = calculateAge(nurse.dob);
      await axios.post("http://localhost:8800/nurses", { ...nurse, age });
      setNurse({ name: "", license_number: "", dob: "" });
      setError(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  // When a nurse is edited, run put command

  const handleEditClick = async (e, nurseId) => {
    e.preventDefault();

    try {
      const age = calculateAge(nurse.dob);
      await axios.put(`http://localhost:8800/nurses/${nurseId}`, { ...nurse, age });
      setError(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  // Calculate age from date of birth

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div>
      <h1>All Nurses</h1>
      <div className="nurses">
        {nurses.map((nurse) => (
          <div className="nurse" key={nurse.id}>
            <h2>{nurse.name}</h2>
            <p>License Number: {nurse.license_number}</p>
            <p>Date of Birth: {nurse.dob}</p>
            <p>Age: {nurse.age}</p>
            <Popup trigger={<button>Edit</button>} modal>
              {close => (
                <div className="form">
                  <h1>Edit Nurse</h1>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    placeholder="License Number"
                    name="license_number"
                    onChange={handleChange}
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    name="dob"
                    onChange={handleChange}
                  />
                  <button onClick={(e) => handleEditClick(e, nurse.id)}>Edit</button>

                  {error && "Error"}
                  <button onClick={() => {
                    close();
                    setError(false);
                    setNurse({ name: "", license_number: "", dob: "" });
                  }}>
                    Close
                  </button>
                </div>
              )}
            </Popup>

            <button className="delete" onClick={() => handleDelete(nurse.id)}>Delete</button>
          </div>
        ))}
      </div>


      <Popup trigger={<button>Add nurse</button>} modal>
        {close => (
          <div className="form">
            <h1>Add New Nurse</h1>
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="License Number"
              name="license_number"
              onChange={handleChange}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              name="dob"
              onChange={handleChange}
            />
            <button onClick={handleAddClick}>Add</button>
            {error && "Error"}
            <button onClick={() => {
              close();
              setError(false);
              setNurse({ name: "", license_number: "", dob: "" });
            }}>
              Close
            </button>
          </div>
        )}
      </Popup>

      <CsvDownloadButton
        data={nurses}
        filename="nurses.csv"
      >
        Export to CSV
      </CsvDownloadButton>
    </div>
  );
};

export default Nurses;
