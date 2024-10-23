import React from "react";
import Navbar from "./_components/navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-10 flex flex-col xl:px-0 container">
      {/* navbar */}
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
