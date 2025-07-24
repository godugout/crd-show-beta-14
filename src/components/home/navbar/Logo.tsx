
import React from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="self-stretch flex items-center my-auto">
      <img
        src="/lovable-uploads/cc3cb17c-e19f-48fa-8991-e6d5ac855379.png"
        className="h-16 w-16 object-contain shrink-0"
        alt="Green and Yellow Stylized G Logo"
      />
    </Link>
  );
};
