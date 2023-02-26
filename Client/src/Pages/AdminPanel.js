import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Autocomplete, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getAllInstitutes } from "../Http/InstituteAPI";

const AdminPanel = () => {
  // const institutes = [
  //   "Высшая школа экономики",
  //   "МГУ им. Ломоносова ",
  //   "Московский физико-технический институт",
  //   "Московский государственный технический университет имени Н.Э.Баумана",
  //   "МИФИ",
  //   "МИСиС",
  //   "Уральский федеральный университет им. Ельцина",
  //   "Томский политехнический университет",
  //   "Российский экономический университет имени Г.В. Плеханова",
  //   "Санкт-Петербургский горный университет ",
  //   "ИТМО ",
  //   "Российская экономическая школа",
  //   "Финансовый университет при Правительстве РФ ",
  //   "РАНХиГС ",
  //   "Санкт-Петербургский политехнический университет Петра Великого",
  //   "Санкт-Петербургский госуниверситет",
  //   "Российский химико-технологический университет имени Д.И. Менделеева",
  //   "Ярославский государственный технический университет",
  //   "МЭИ ",
  //   "Балтийский государственный технический университет «ВОЕНМЕХ» им. Устинова",
  // ];
  const users = [
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
    "Чернова Екатерина Руслановна",
    "Кузнецова Диана Тимофеевна",
    "Чижов Платон Ярославович",
    "Михайлова Алина Тимуровна",
    "Сидорова Милана Тимофеевна",
    "Денисов Кирилл Платонович",
    "Петров Александр Адамович",
    "Семина Вероника Никитична",
    "Анисимова Екатерина Ильинична",
    "Зайцев Егор Никитич",
  ];
  const institutes = getAllInstitutes();
  const [universities, setUniversities] = useState(institutes.sort());
  return (
    <Container>
      <div>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={users}
          sx={{ width: 300, margin: "auto", marginBottom: "20px" }}
          renderInput={(params) => (
            <TextField {...params} label="Пользователи" />
          )}
        />
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {institutes.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={universities}
          sx={{ width: 300, margin: "auto", marginBottom: "20px" }}
          renderInput={(params) => <TextField {...params} label="ВУЗы" />}
        />
      </div>
    </Container>
  );
};

export default AdminPanel;
