console.log("SERVER FILE STARTED");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect("mongodb+srv://korrapatijaideep048_db_user:test123@cluster0.xkbd7rb.mongodb.net/googleform?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB CONNECTION ERROR:", err));



mongoose.connection.on("connected", () => {
  console.log("MongoDB CONNECTED EVENT FIRED");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB CONNECTION ERROR:", err);
});


app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Create Schema
const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"]
  },
  optionalText: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});


// Create Model
const Form = mongoose.model("Form", formSchema);

// POST route to save form data
app.post("/submit", async (req, res) => {
  try {
    const newForm = new Form(req.body);
    await newForm.save();

    res.json({ message: "Form data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


//get api to retrive the data
app.get("/submissions", async (req, res) => {
  try {
    const data = await Form.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


app.get("/api/responses", async (req, res) => {
  try {
    const responses = await Form.find().sort({ createdAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

//delete response 
app.delete("/api/responses/:id", async (req, res) => {
  try {
    const deleted = await Form.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Response not found" });
    }

    res.json({ message: "Response deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});
