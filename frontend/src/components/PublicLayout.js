import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout(){
  return (
    <>
      <Navbar />
      <main style={{paddingTop:68}}><Outlet /></main>
      <Footer />
    </>
  );
}
