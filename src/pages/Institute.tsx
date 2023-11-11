import React, { useEffect, useState } from "react";
import { getInstituteDescription } from "../api/InstituteAPI";
import { Ientered } from "../api/userAPI";
import "../styles/css/Institute.css";

/**
 * Интерфейс для данных, получаемых от API.
 */
interface InstituteData {
  description: string;
  listOfIncoming: Array<{
    firstname: string;
    lastname: string;
    surname: string;
  }> | null;
  name: string;
}

/**
 * Компонент для отображения информации об институте.
 */
const Institute = (): JSX.Element => {
  const currentURL = window.location.href;
  const id = +currentURL.substring(currentURL.lastIndexOf("/") + 1);

  const [screenShot, setScreenshot] = useState<string | undefined>("");
  const [description, setDescription] = useState<string>("");
  const [listOfIncoming, setListOfIncoming] = useState<Array<any> | null>(null);
  const [name, setName] = useState<string>("");
  const [confirm, setConfirm] = useState<string | null>(null);

  /**
   * Загрузка данных о институте.
   */
  const fetchData = async (): Promise<void> => {
    try {
      const response = await getInstituteDescription(id);

      const instituteData: InstituteData = response;
      const { description, listOfIncoming, name } = instituteData;

      setDescription(description);
      setListOfIncoming(listOfIncoming);
      setName(name);
    } catch (error) {
      console.error("Произошла ошибка при загрузке данных", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleConfirmation = async () => {
    if (confirm !== "200") {
      const confirmation = await Ientered(id);
      setConfirm(confirmation + "");
    }
  };

  return (
    <div className="Institute-page">
      <h2 className="Institute-name">{name || "Lorem ipsum dolor sit amet"}</h2>
      <button
        disabled={confirm === "200"}
        onClick={handleConfirmation}
        className="IenteredButton"
      >
        {confirm === "200" ? "Вы поступили в этот ВУЗ" : "Я поступил"}
      </button>
      {screenShot ? (
        <img
          src={screenShot}
          className="Institute-screenshot"
          alt="Скриншот института"
        />
      ) : (
        <h6 style={{ textAlign: "center", margin: "20px 0" }}>
          Показ скриншота
        </h6>
      )}

      <h3 className="Institute-description">
        {description ||
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."}
      </h3>
      {listOfIncoming ? (
        listOfIncoming.map((incomer, index) => (
          <div key={index}>
            <h4 className="Institute-incomer">
              {incomer.firstname} {incomer.lastname} {incomer.surname}
            </h4>
            <div className="black-stripe" />
          </div>
        ))
      ) : (
        <h6 style={{ textAlign: "center", margin: "0 0 20px" }}>
          Никто не поступил
        </h6>
      )}
    </div>
  );
};

export default Institute;
