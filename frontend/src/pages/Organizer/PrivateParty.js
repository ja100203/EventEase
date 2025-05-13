import React, { useState } from 'react';
import { uploadCSV, sendWhatsAppMessages } from '../../api/privateParty';
import '../../styles/Organiser.css'; // External CSS

const PrivatePartyUpload = () => {
  const [file, setFile] = useState(null);
  const [eventName, setEventName] = useState('');
  const [partyId, setPartyId] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !eventName) return alert("Please select CSV and enter Event Name");

    const formData = new FormData();
    formData.append("csvFile", file);
    formData.append("eventName", eventName);

    try {
      const res = await uploadCSV(formData);
      alert("CSV uploaded!");
      setPartyId(res.data.party._id);
    } catch (error) {
      console.error(error);
      alert("Failed to upload CSV");
    }
  };

  const handleSendMessages = async (e) => {
    e.preventDefault();
    if (!partyId || !message) return alert("Missing partyId or message");

    try {
      const res = await sendWhatsAppMessages({ partyId, message });
      alert(res.data.message || "Messages sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send WhatsApp messages");
    }
  };

  return (
    <div className="party-body">
    <div className="party-container">
      <div className="private-glass-card">
        <h2 className="private-form-title">🎉 Upload CSV for Private Party</h2>
        <form onSubmit={handleUpload} className="private-upload-form">
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            className="private-input-field"
          />
          <input
            type="file"
            accept=".csv"
            onChange={e => setFile(e.target.files[0])}
            className="private-input-field"
          />
          <button type="submit" className="private-btn-primary">📤 Upload CSV</button>
        </form>

        {partyId && (
          <form onSubmit={handleSendMessages} className="private-upload-form">
            <h3 className="private-form-subtitle">💬 Send WhatsApp Message</h3>
            <textarea
              placeholder="Enter your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="private-input-textarea"
              rows="4"
            ></textarea>
            <button type="submit" className="private-btn-secondary">📲 Send WhatsApp Messages</button>
          </form>
        )}
      </div>
    </div>
    </div>
  );
};

export default PrivatePartyUpload;
