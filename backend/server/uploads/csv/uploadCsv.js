const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const router = express.Router();

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, "../../uploads/csv");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `private_party_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// ✅ Upload CSV Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ CSV Uploaded:", req.file.filename);

    // Call Python script to process CSV
    exec(`python3 utils/send_bulk_sms.py ${req.file.path}`, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error executing Python script:", error);
        return res.status(500).json({ message: "Error processing CSV" });
      }

      console.log("✅ Bulk SMS Sent:", stdout);
      res.status(200).json({ message: "CSV uploaded & messages sent successfully" });
    });
  } catch (error) {
    console.error("❌ Error uploading CSV:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

module.exports = router;
