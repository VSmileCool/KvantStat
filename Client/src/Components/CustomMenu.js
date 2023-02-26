import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import "../Styles/CustomMenu.css";
import { getInstitutes } from "../Http/InstituteAPI";

export const CustomMenu = React.forwardRef(({ children, className }, ref) => {
  const [value, setValue] = useState("");
  let data;
  useEffect((data) => {
    data = [getInstitutes()];
  });
  return (
    <div className={className}>
      <Form.Control
        autoFocus
        className="search"
        placeholder="Type to filter..."
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <ul>{data.map(<p></p>)}</ul>
    </div>
  );
});
