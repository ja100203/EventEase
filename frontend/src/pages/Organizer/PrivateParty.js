import React, { useState } from 'react';
import { uploadCSV, sendWhatsAppMessages } from '../../api/privateParty';
import '../../styles/Organiser.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';

const PrivatePartyUpload = () => {
  const [file, setFile] = useState(null);
  const [eventName, setEventName] = useState('');
  const [partyId, setPartyId] = useState('');
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !eventName) {
      toast.warn("⚠️ Please select a CSV file and enter the event name.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);
    formData.append("eventName", eventName);

    try {
      const res = await uploadCSV(formData);
      setPartyId(res.data.party._id);
      toast.success("✅ CSV uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to upload CSV.");
    }
  };

  const handleSendMessages = async () => {
    if (!partyId || !message) {
      toast.warn("⚠️ Please provide a message before sending.");
      return;
    }

    try {
      const res = await sendWhatsAppMessages({ partyId, message });
      toast.success(res.data.message || "✅ WhatsApp messages sent!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to send WhatsApp messages.");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="party-body">
      <div className="party-header">
        <button className="party-close-btn" onClick={() => navigate('/organizer/dashboard')}>
          ❌
        </button>
      </div>

      <div className={`party-container ${partyId ? 'shift-up' : ''}`}>
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
            <div className="whatsapp-fade-in">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!message) {
                    toast.warn("⚠️ Enter a message before sending.");
                    return;
                  }
                  setShowConfirm(true);
                }}
                className="private-upload-form"
              >
                <h3 className="private-form-subtitle">💬 Send WhatsApp Message</h3>
                <textarea
                  placeholder="Enter your message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="private-input-textarea"
                  rows="3"
                ></textarea>
                <button type="submit" className="private-btn-secondary">📲 Send WhatsApp Messages</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirm}
        message="Are you sure you want to send this message to all recipients?"
        onConfirm={handleSendMessages}
        onClose={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default PrivatePartyUpload;
