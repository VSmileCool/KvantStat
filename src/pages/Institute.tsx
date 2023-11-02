import React, { useEffect, useState } from "react";
import { getImg, getInstituteDescription } from "../api/InstituteAPI";
import "../styles/css/Institute.css";

const Institute = () => {
  const currentURL = window.location.href;
  const id = currentURL.substring(currentURL.lastIndexOf("/") + 1);
  const [screenShot, setScreenshot] = useState<string | undefined>();
  const [description, setDescription] = useState<string>("");
  const [listOfIncoming, setListOfIncoming] = useState<Array<string> | null>(
    null
  );
  const [name, setName] = useState<string>();
  useEffect(() => {
    async function fetchData() {
      const img = await getImg(id);
      console.log(`got response ${img}`);
      setScreenshot(URL.createObjectURL(img));
      const response = await getInstituteDescription(id);
      setDescription(response.data.description);
      setListOfIncoming(response.data.listOfIncoming);
      setName(response.data.name);
    }

    fetchData();
  }, [id]);
  return (
    <div className="Institute-page">
      <h2 className="Institute-name">
        {name ? name : "Lorem ipsum dolor sit amet"}
      </h2>
      {screenShot ? (
        <img src={screenShot} className="Institute-screenshot" />
      ) : (
        <h6 style={{ textAlign: "center", margin: "0 0 20px 0" }}>
          showing screen capture
        </h6>
      )}

      <h3 className="Institute-description">
        {description
          ? description
          : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem " +
            "sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per " +
            "conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus."}
      </h3>
      {listOfIncoming ? (
        listOfIncoming.map((incomer) => (
          <div>
            <h4 className="Institute-incomer">{incomer}</h4>
            <div className="black-stripe" />
          </div>
        ))
      ) : (
        <h6 style={{ textAlign: "center", margin: "0 0 20px 0" }}>
          Никто не поступил
        </h6>
      )}
    </div>
  );
};

export default Institute;
