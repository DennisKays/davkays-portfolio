import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="contact-box">
          <div className="contact-glow" />

          <div className="contact-content">
            <span className="section-label">05 / Contact</span>

            <h2>
              Have an idea?
              <span> Let&apos;s build it.</span>
            </h2>

            <p>
              Whether you need a management system, a web application or a
              custom digital solution, let&apos;s discuss the problem and find
              the right approach.
            </p>

            <div className="contact-actions">
              <a
                className="button button-primary"
                href="mailto:davidkanyurira6@gmail.com?subject=Software%20Project%20Enquiry"
              >
                <Mail size={18} />
                Email DavKays
              </a>

              <a
                className="button button-secondary"
                href="https://www.linkedin.com/in/david-kanyurira-7b9076436"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <ArrowUpRight size={18} />
              </a>
            </div>

            <div className="contact-methods">
              <a
                href="mailto:davidkanyurira6@gmail.com"
                className="contact-method"
              >
                <span className="contact-method-icon">
                  <Mail size={17} />
                </span>
                <span>
                  <small>Email</small>
                  <strong>davidkanyurira6@gmail.com</strong>
                </span>
              </a>

              <a href="tel:0782400100" className="contact-method">
                <span className="contact-method-icon">
                  <Phone size={17} />
                </span>
                <span>
                  <small>Phone</small>
                  <strong>0782400100</strong>
                </span>
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
                  <strong>0711881780</strong>
                </span>
              </a>

              <a href="tel:0788479113" className="contact-method">
                <span className="contact-method-icon">
                  <Phone size={17} />
                </span>
                <span>
                  <small>Phone</small>
                  <strong>0788479113</strong>
                </span>
              </a>
            </div>
          </div>

          <div className="contact-side">
            <div className="contact-side-icon">
              <MessageCircle size={25} />
            </div>

            <span>Let&apos;s talk</span>

            <strong>
              Turn your
              <br />
              problem into
              <br />
              a solution.
            </strong>

            <div className="contact-line">
              <span />
              <Send size={14} />
            </div>

            <a
              className="contact-linkedin"
              href="https://www.linkedin.com/in/david-kanyurira-7b9076436"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Profile
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
