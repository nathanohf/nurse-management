import express from "express";
import mysql2 from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "ty5969888",
  database: "nurse_management"
});

// Middleware

app.use(express.json());
app.use(cors());

db.connect((err) => {
  if (err) {
    console.error('error: ', err);
    process.exit(1);
  }
});

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/nurses", (req, res) => {
  const q = "SELECT * FROM nurses";
  db.query(q, (err, data) => {
    if (err) return res.json(err);

    const formattedData = data.map((nurse) => {
      return {
        ...nurse,
        dob: nurse.dob.toISOString().split('T')[0],
        age: calculateAge(nurse.dob)
      };
    });

    return res.json(formattedData);
  });
});

app.post("/nurses", (req, res) => {
  const { name, license_number, dob } = req.body;
  const age = calculateAge(dob);

  const q = "INSERT INTO nurses (`name`, `license_number`, `dob`, `age`) VALUES (?, ?, ?, ?)";
  const values = [name, license_number, dob, age];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("edited");
  });
});

app.delete("/nurses/:id", (req, res) => {
  const nurseId = req.params.id;
  const q = "DELETE FROM nurses WHERE id = ?";

  db.query(q, [nurseId], (err, data) => {
    if (err) return res.json(err);
    return res.json("deleted");
  });
});

app.put("/nurses/:id", (req, res) => {
  const nurseId = req.params.id;
  const q = "UPDATE nurses SET `name`= ?, `license_number`= ?, `dob`= ?, `age`= ? WHERE id = ?";

  const values = [
    req.body.name,
    req.body.license_number,
    req.body.dob,
    req.body.age,
  ];

  db.query(q, [...values, nurseId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Server is running on port 8800");
});

// Get age from dob

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
