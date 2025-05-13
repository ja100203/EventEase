import axios from './axios';

export const uploadCSV = (formData) => {
  return axios.post("/private_party/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

export const sendWhatsAppMessages = ({ partyId, message }) => {
  return axios.post("/private_party/send_messages", { partyId, message }, {
    withCredentials: true,
  });
};
