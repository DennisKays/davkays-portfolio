import Navbar from "../components/Navbar";
import StudioHome from "../components/StudioHome";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <StudioHome />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default Home;