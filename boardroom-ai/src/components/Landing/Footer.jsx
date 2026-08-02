import React from "react";
import "./Footer.css";
import {
  Mail,
  MapPin,
  Globe,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}

        <div className="footer-brand">

          <h2>
            Board<span>Room AI</span>
          </h2>

          <p>
            Empowering businesses with AI executives that think,
            collaborate and make smarter strategic decisions.
          </p>

          <button
            className="back-top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <ArrowUp size={18} />
            Back to Top
          </button>

        </div>

        {/* Quick Links */}

        <div className="footer-links">

          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          <a href="#">How It Works</a>

        </div>

        {/* Legal */}

        <div className="footer-links">

          <h3>Legal</h3>

          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>

        </div>

        {/* Contact */}

        <div className="footer-links">

          <h3>Contact</h3>

          <div className="contact-item">
            <Mail size={18} />
            support@boardroomai.com
          </div>

          <div className="contact-item">
            <MapPin size={18} />
            Hyderabad, India
          </div>

          <div className="contact-item">
            <Globe size={18} />
            www.boardroomai.com
          </div>

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 BoardRoom AI. All Rights Reserved.
      </div>

    </footer>
  );
}