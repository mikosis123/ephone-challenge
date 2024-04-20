import React from "react";

const Nav = () => {
  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-gray-300 p-6">
        <div className="flex items-center  flex-shrink-0 text-white mr-6 w-full">
          <h1 className="font-semibold shadow-sm  text-2xl text-[#3730a3] tracking-tight">
            ReactFlow Menu Extraction and Visualization Challenge
          </h1>
          <span className="ml-3 text-xl ml-auto text-[#3730a3]">
            EPphone Challange
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
