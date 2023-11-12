import React, { useEffect, useState } from "react";
import { getInstituteDescription } from "../api/InstituteAPI";
import { getUserInfo, Ientered } from "../api/userAPI";
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
  uni_img: string;
  name: string;
}

/**
 * Компонент для отображения информации об институте.
 */
const Institute = (): JSX.Element => {
  const currentURL = window.location.href;
  const id = +currentURL.substring(currentURL.lastIndexOf("/") + 1);

  const [uni_img, setUniImg] = useState<string | undefined>(
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.0Nm2Ca65y0oMvs8RZtrkLQHaE7%26pid%3DApi&f=1&ipt=9c0bb7bcb3590776dd58d340b45033f0c48214ed2b7238f28a87c762fcbae3d4&ipo=images"
  );
  const [description, setDescription] = useState<string>("");
  const [listOfIncoming, setListOfIncoming] = useState<Array<any> | null>(null);
  const [name, setName] = useState<string>("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [institute, setInstitute] = useState<any>();
  const [coincidence, setCoincidence] = useState<boolean | string>();
  const [userInfo, setUserInfo] = useState<any>();

  const searchStudents = async (): Promise<boolean | string> => {
    if (userInfo.institute) {
      return userInfo.institute == institute.name;
    }
    return "Не поступил";
  };
  const userCoincidence = async () => {
    const response = await searchStudents();
    setCoincidence(response);
  };
  userCoincidence();
  /**
   * Загрузка данных о институте.
   */
  const fetchData = async (): Promise<void> => {
    try {
      const instituteData: InstituteData = await getInstituteDescription(id);
      const userInfo = getUserInfo();
      setUserInfo(userInfo);
      setInstitute(instituteData);
      const { description, listOfIncoming, name, uni_img } = instituteData;

      console.log(uni_img);

      setUniImg(uni_img);
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
      {coincidence == false ? null : (
        <button
          disabled={coincidence == true}
          onClick={() => {
            handleConfirmation();
            fetchData();
          }}
          className="IenteredButton"
        >
          {coincidence == true ? "Вы поступили в этот ВУЗ" : "Я поступил"}
        </button>
      )}
      <img
        src={uni_img}
        className="Institute-screenshot"
        alt="Скриншот института"
      />

      <h3 className="Institute-description">
        {description ||
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."}
      </h3>
      <h4 className="Incoming-title">Список постувиших</h4>
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
