import React, { useState } from "react";
import "../styles/css/AboutUs.css";
import Selector from "../components/Selector";
import TextAboutUs from "../components/TextAboutUs";

const AboutUs = () => {
  const [id, setId] = useState<number>(1);

  const handleIdChange = (newId: number) => {
    setId(newId);
  };

  return (
    <div className="AboutBlock">
      <Selector id={id} onIdChange={handleIdChange} />
      <TextAboutUs id={id} />
    </div>
  );
};

export default AboutUs;
