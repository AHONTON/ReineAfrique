import React from "react";

const Wrapper = ({ children, className = "" }) => {
  return (
    <div
      className={`
        w-full
        max-w-full
        overflow-x-hidden
        relative
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Wrapper;
