import { Mail, Phone, MessageCircle, ArrowUpRight } from "lucide-react";

function Contact() {
return (
<section className="section contact-section" id="contact">
<div className="container">
<div className="contact-box">
<div className="contact-glow" />

      <div className="contact-content">
        <span className="section-label">05 / Contact</span>

        <h2>
          Get in
          <span> Touch.</span>
        </h2>

        <p>
          Have a question or a project in mind? Choose the best way
          to reach me, and let's discuss your requirements.
        </p>

        <div className="contact-methods">
          <a
            href="mailto:davidkanyurira6@gmail.com?subject=Software%20Project%20Enquiry"
            className="contact-method"
          >
            <span className="contact-method-icon">
              <Mail size={17} />
            </span>
            <span>
              <small>Email</small>
              <strong>davidkanyurira6@gmail.com</strong>
            </span>
            <ArrowUpRight size={15} />
          </a>

          <a
            href="tel:0782400100"
            className="contact-method"
          >
            <span className="contact-method-icon">
              <Phone size={17} />
            </span>
            <span>
              <small>Phone</small>
              <strong>Call me directly</strong>
            </span>
            <ArrowUpRight size={15} />
          </a>

          <a
            href="https://wa.me/263711881780"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-method"
          >
            <span className="contact-method-icon">
              <MessageCircle size={17} />
            </span>
            <span>
              <small>WhatsApp</small>
              <strong>Message me directly</strong>
            </span>
            <ArrowUpRight size={15} />
          </a>

          <a
            href="https://www.linkedin.com/in/david-kanyurira-7b9076436"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-method"
          >
            <span className="contact-method-icon">
              <ArrowUpRight size={17} />
            </span>
            <span>
              <small>LinkedIn</small>
              <strong>Connect professionally</strong>
            </span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

);
}

export default Contact;