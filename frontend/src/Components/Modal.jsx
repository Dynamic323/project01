import React from "react";

function Modal({ children }) {
  return (
    <div className=" shadow-xl h-[400px] flex justify-center items-center">
      {children}
    </div>
  );
}

export default Modal;
