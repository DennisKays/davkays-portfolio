import { ArrowUpRight } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            <span className="brand-mark">DK</span>
            <span>DavKays Softwares</span>
          </div>

          <p className="footer-text">
            Building practical software solutions for modern businesses.
          </p>
        </div>

        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/david-kanyurira-7b9076436"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
            <ArrowUpRight size={15} />
          </a>

          <a href="mailto:davidkanyurira6@gmail.com">
            Email
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} DavKays Softwares. All rights reserved.</span>
        <span>Designed & built by DavKays.</span>
      </div>
    </footer>
  );
}

export default Footer;