const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Replace with your MongoDB connection string
const mongoURI =
  "mongodb+srv://bryanojji4:UgrtmaA6UhRqwTyD@pothole.xemfaeu.mongodb.net/?retryWrites=true&w=majority&appName=Pothole";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define schema and model for pothole data
const PotholeSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Pothole = mongoose.model("Pothole", PotholeSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API endpoint to receive pothole data
app.post("/api/pothole", async (req, res) => {
  const { lat, lng } = req.body;

  try {
    // Check if the entry already exists
    const existingPothole = await Pothole.findOne({
      latitude: lat,
      longitude: lng,
    });
    if (existingPothole) {
      return res.status(200).json({ message: "Duplicate pothole data" });
    }

    // Save new pothole data
    const newPothole = new Pothole({
      latitude: lat,
      longitude: lng,
    });

    await newPothole.save();
    res
      .status(200)
      .json({ message: "Pothole data received", data: newPothole });
  } catch (err) {
    res.status(400).json({ message: "Error saving data", error: err });
  }
});

// API endpoint to retrieve pothole data
app.get("/api/potholes", async (req, res) => {
  try {
    const potholes = await Pothole.find();
    res.json(potholes);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving data", error: err });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
