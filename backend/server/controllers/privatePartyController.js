const PrivateParty = require("../models/PrivateParty");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const { spawn } = require("child_process");

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/csv/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `party_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage }).single("csvFile");

// ✅ Upload CSV & Store Data
const uploadCSV = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: "File upload failed", err });

        const { eventName } = req.body;
        const csvFilePath = req.file.path;
        const contacts = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on("data", (row) => {
                if (row.name && row.phone) {
                    contacts.push({ name: row.name, phone: row.phone });
                }
            })
            .on("end", async () => {
                const newParty = new PrivateParty({
                    user: req.user._id,
                    eventName,
                    contacts,
                    csvFilePath,
                });

                await newParty.save();
                res.status(201).json({ message: "CSV uploaded & data stored", party: newParty });
            });
    });
};

// ✅ Trigger Bulk Messaging via Python Script
const sendBulkMessages = async (req, res) => {
    const { partyId, message } = req.body;

    const party = await PrivateParty.findById(partyId);
    if (!party) return res.status(404).json({ message: "Private party not found" });

    const contacts = party.contacts;

    const timestamp = Date.now();
    const filePath = `temp_contacts_${timestamp}.csv`;

    const csvContent = contacts.map(c => `${c.name},${c.phone}`).join("\n");
    fs.writeFileSync(filePath, "name,phone\n" + csvContent);

    const pathToScript = path.join(__dirname, "../utils/send_whatsapp_messages.py");
    const pythonProcess = spawn("python", [pathToScript, filePath, message]);
    
    pythonProcess.stdout.on("data", (data) => {
        console.log(`Python Output: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        fs.unlinkSync(filePath);
        if (code === 0) {
            res.status(200).json({ message: "WhatsApp messages sent successfully" });
        } else {
            res.status(500).json({ message: "Failed to send WhatsApp messages" });
        }
    });
};

module.exports = { uploadCSV, sendBulkMessages };
