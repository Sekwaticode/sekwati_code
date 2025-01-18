"use client"

import React, { useState } from "react";

const FormToWhatsApp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const { name, email, message } = formData;

    // Construct the WhatsApp message
    const whatsappMessage = `Hello, my name is ${name}. My email is ${email}. Here's my message: ${message}`;

    // Open WhatsApp with the pre-filled message
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const phoneNumber = "27696731098"; // Replace with your WhatsApp number
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <form>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="message">Message:</label>
          <br />
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", height: "100px" }}
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            backgroundColor: "#25D366",
            color: "white",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          Send to WhatsApp
        </button>
      </form>
    </div>
  );
};

export default FormToWhatsApp;
