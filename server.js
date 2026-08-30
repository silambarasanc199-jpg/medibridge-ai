const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "MediBridge AI Backend is running",
        status: "online"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        service: "MediBridge AI API",
        status: "healthy"
    });
});

app.post("/api/screening", (req, res) => {

    const {
        patientName,
        age,
        symptoms,
        duration
    } = req.body;

    if (!patientName || !age || !symptoms || !duration) {
        return res.status(400).json({
            success: false,
            message: "Required screening information is missing."
        });
    }

    res.json({
        success: true,
        message: "Screening received successfully.",
        screening: {
            patientName,
            age,
            symptoms,
            duration
        }
    });
});

app.listen(PORT, () => {
    console.log(`MediBridge AI backend running on port ${PORT}`);
});