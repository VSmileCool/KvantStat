import React from "react";

interface TextAboutUsProps {
  id: number;
}

const TextAboutUs: React.FC<TextAboutUsProps> = ({ id }) => {
  const textAboutUs = [
    { id: 1, text: "Text 1 " },
    { id: 2, text: "Text 2" },
    { id: 3, text: "Text 3" },
  ];

  function getDataById(id: number) {
    return textAboutUs.find((item) => item.id === id);
  }

  const selectedData = getDataById(id);

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {selectedData ? (
        selectedData.text
      ) : (
        <span style={{ color: "red" }}>Data not found</span>
      )}
    </div>
  );
};

export default TextAboutUs;
