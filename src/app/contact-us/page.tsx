"use client";

import { useState } from "react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setResponseMessage("Thank you for reaching out! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setResponseMessage("Oops! Something went wrong. Please try again later.");
      }
    } catch (error) {
      setResponseMessage("Error sending your message. Please try again later.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4 space-y-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Have questions or feedback? We&#39;d love to hear from you. Please fill out the form below, and we&#39;ll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-2 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your Full Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-2 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your Email Address"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-lg font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="mt-2 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Subject of Your Message"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-lg font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              className="mt-2 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Send Message"}
            </button>
          </div>
        </form>

        {responseMessage && (
          <div className="mt-6 text-center text-lg font-medium text-green-600">
            {responseMessage}
          </div>
        )}
      </div>

      {/* Google Map Section */}
      <div className="max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Our Location</h2>
        <iframe
        title="gmap"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.495685515688!2d77.71124277624678!3d29.045513481664963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c63fa40b9a0f3%3A0x66d1527997a8c64e!2s350%2F9%2C%20Dev%20Nagar%2C%20Phase-1%2C%20Modipuram%2C%20Meerut%2C%20Uttar%20Pradesh%20250002!5e0!3m2!1sen!2sin!4v1698424062826!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          className="rounded-lg shadow-md m-5"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
