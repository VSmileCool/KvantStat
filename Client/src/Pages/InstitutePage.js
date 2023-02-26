import React from "react";
import { Container } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { INSTITUTEPAGE_ROUTE } from "../Router/Consts";

const InstitutePage = () => {
  const students = [
    "Журавлев Тимофей Максимович",
    "Трошин Фёдор Ильич",
    "Губанова Варвара Александровна",
    "Рыжов Артём Владиславович",
    "Никонов Артём Андреевич",
    "Зиновьев Платон Фёдорович",
    "Трофимов Иван Тимурович",
    "Постникова Дарья Артёмовна",
    "Озеров Даниил Марсельевич",
    "Алексеев Вячеслав Ярославович",
  ];
  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>
        Московский физико-технический институт
      </h1>
      <div>
        <h2 style={{ textAlign: "center" }}>Поступившие</h2>
        <ListGroup
          style={{ margin: "auto", maxWidth: "600px", marginBottom: "50px" }}
        >
          {students.map((institute) => (
            <ListGroup.Item
              style={{ maxWidth: "600px", textDecoration: "none" }}
            >
              <Row style={{ textDecoration: "none" }}>
                <a
                  style={{ color: "black", textDecoration: "none" }}
                  href={INSTITUTEPAGE_ROUTE}
                >
                  {institute}
                </a>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Container>
  );
};

export default InstitutePage;
