import React, { useEffect, useState } from "react";
import { getImg, getInstituteDescription } from "../api/InstituteAPI";
import { instituteEntry } from "../api/userAPI";
import "../styles/css/Institute.css";

/**
 * Интерфейс для данных, получаемых от API.
 */
interface InstituteData {
  description: string;
  listOfIncoming: string[] | null;
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
  const [listOfIncoming, setListOfIncoming] = useState<string[] | null>(null);
  const [name, setName] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  /**
   * Загрузка данных о институте.
   */
  const fetchData = async (): Promise<void> => {
    try {
      const [img, response] = await Promise.all([
        getImg(id),
        getInstituteDescription(id),
      ]);

      console.log(`Получен ответ ${img}`);
      setScreenshot(URL.createObjectURL(img));

      const instituteData: InstituteData = response.data;
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

  return (
    <div className="Institute-page">
      <h2 className="Institute-name">{name || "Lorem ipsum dolor sit amet"}</h2>
      <button
        disabled={confirmation === "200"}
        onClick={async () => {
          const result = await instituteEntry(id);
          setConfirmation(result + "");
        }}
        className="IenteredButton"
      >
        {confirmation === "200" ? "Вы поступили в этот ВУЗ" : "Я поступил"}
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
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. "}
      </h3>

      {listOfIncoming ? (
        listOfIncoming.map((incomer) => (
          <div key={incomer}>
            <h4 className="Institute-incomer">{incomer}</h4>
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
