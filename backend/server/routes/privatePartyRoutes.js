const express = require("express");
const { uploadCSV, sendBulkMessages } = require("../controllers/privatePartyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", protect, uploadCSV);
router.get("/test", (req, res) => {
    res.send("Private Party Routes Working ✅");
  });  
router.post("/send_messages", protect, sendBulkMessages);

module.exports = router;
