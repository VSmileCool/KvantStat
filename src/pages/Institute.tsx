import React, { useEffect, useState } from "react";
import { getImg, getInstituteDescription } from "../api/InstituteAPI";
import "../styles/css/Institute.css";
import { Ientered } from "../api/userAPI";
import { useSelector } from "react-redux";
import { RootState } from "../store/userSlice";

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
  const [confirm, setConfirm] = useState<string | null>(null);
  const access_token = useSelector((state: RootState) => state.access_token);
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
        disabled={confirm == "200"}
        onClick={() => {
          const confirmation = Ientered(id, access_token);
          setConfirm(confirmation + "");
        }}
        className="IenteredButton"
      >
        {confirm == "200" ? "Вы поступили в этот ВУЗ" : "Я поступил"}
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
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem " +
            "sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per " +
            "conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus."}
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
