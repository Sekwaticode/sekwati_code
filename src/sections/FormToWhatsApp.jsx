"use client";

import React, { useState } from "react";
import ArrowRight from "@/assets/arrow-right.svg";

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
    <section
      className="bg-gradient-to-b from-white to-[#B18197] py-24 overflow-x-clip"
      id="Contact"
    >
      <div
        style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}
        className="bg-gradient-to-b from-white to-[#B18197] py-24 overflow-x-clip"
      >
        <h2 className="section-title">Contact us Now</h2>
        <p className="section-description mt-5">
          Let us know what you’re looking for, and our expert team will bring
          your vision to life. Don’t wait—reach out today and let’s create a
          solution that elevates your brand and drives results!
        </p>
        <form action="https://api.web3forms.com/submit" method="POST">
          <input
            type="hidden"
            name="access_key"
            value="568cac2c-b74a-4c70-a437-a31c4e11eed3"
          />

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="name" className="tag">
              Name:
            </label>
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
            <label htmlFor="email" className="tag">
              Email:
            </label>
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
            <label htmlFor="message" className="tag">
              Message:
            </label>
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
            className="btn btn-primary"
          >
            Send to WhatsApp
          </button>
          <button type="submit" className="btn btn-primary bg-white text-black">
            Submit Form
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default FormToWhatsApp;
