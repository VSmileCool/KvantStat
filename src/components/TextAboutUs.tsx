import React from "react";
import "../styles/css/TextAboutUs.css";

/**
 * Компонент текста "О нас".
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {number} props.id - Идентификатор текста.
 * @returns {JSX.Element} - Элемент React.
 */
const TextAboutUs: React.FC<{ id: number }> = ({ id }) => {
  /**
   * Массив с данными текстов "О нас".
   * @type {Array}
   */
  const textAboutUs = [
    {
      id: 1,
      text: "«Кванториум» – это уникальная среда для ускоренного развития ребенка по актуальным научно-исследовательским и инженерно-техническим направлениям, оснащенная высокотехнологичным оборудованием. Отличительной особенностью является не только обучение детей инженерному образованию, но и проектной деятельности, ТРИЗ (теория решения изобретательских задач), 4К-компетенциям (коммуникация, креативность, командное решение проектных задач, критическое мышление) и решение реальных производственных задач в сопровождении опытных наставников, в том числе представителей научной школы, промышленности и бизнеса. Федеральным оператором проекта «Кванториум» является ФГАУ «Фонд новых форм развития образования». Проект ДТ «Кванториум» реализуется с 2015 года и был поддержан Президентом Российской Федерации В.В. Путиным. Занятия в технопарке бесплатны и доступны не только жителям городов, но и учащимся из сельской местности.",
    },
    {
      id: 2,
      text: "Понедельник-четверг - с 9:00 до 18:00.\nПятница - с 9:00 до 17:00\nОбед - 13:00 до 13:45.\nАдрес: 390013, г. Рязань, ул. Дзержинского, 6 \nТелефоны: +7 (4912) 55-92-80\nE-mail: druzhba.kvant@ryazan.gov.ru\nVK: kvantorium62\nTelegram: Druzhba62\n",
    },
    {
      id: 3,
      text: "   Наш проект предоставляет полезную информацию и помогает участникам принимать осознанные решения относительно своего образования и будущей карьеры. Он предоставляет статистику о выпускниках Кванториума и информации о местах, куда они поступили. Это имеет важное значение для потенциальных учеников, их родителей и образовательных учреждений. Первоначальная задача данного проекта заключается в сборе данных о выпускниках школы и местах, куда они поступили после окончания обучения. Эти данные включают информацию о высших учебных заведениях, колледжах и университетах, а также о профессиональных школах или специализированных курсах, которые выбрали выпускники.",
    },
  ];

  /**
   * Получить данные по идентификатору.
   *
   * @function
   * @param {number} id - Идентификатор.
   * @returns {Object | undefined} - Данные текста или undefined, если не найдено.
   */
  function getDataById(id: number) {
    return textAboutUs.find((item) => item.id === id);
  }

  /**
   * Выбранные данные.
   * @type {Object | undefined}
   */
  const selectedData = getDataById(id);

  return (
    <div className="Text-about-us">
      {selectedData ? (
        <div
          style={
            selectedData.id === 2
              ? {
                  textAlign: "center",
                  margin: "42px auto",
                  textIndent: "0em",
                  lineHeight: "1.5em",
                }
              : {
                  textAlign: "justify",
                  margin: "52px auto",
                  lineHeight: "1.5em",
                }
          }
        >
          {selectedData.text}
        </div>
      ) : (
        <span style={{ color: "red" }}>Данные не найдены</span>
      )}
    </div>
  );
};

export default TextAboutUs;
