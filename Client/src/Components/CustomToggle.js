import React from "react";

export const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    style={{ textDecoration: "none", color: "#09BC8A", fontWeight: "bold" }}
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));
