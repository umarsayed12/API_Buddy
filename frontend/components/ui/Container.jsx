import React from "react";

const Container = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {children}
    </div>
  );
};

export default Container;
