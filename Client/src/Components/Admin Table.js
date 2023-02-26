import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const users = [
  { lastname: "Журавлев", name: "Тимофей", middle_name: "Максимович" },
  { lastname: "Трошин", name: "Фёдор", middle_name: "Ильич" },
  { lastname: "Губанова", name: "Варвара", middle_name: "Александровна" },
  { lastname: "Рыжов", name: "Артём", middle_name: "Владиславович" },
  { lastname: "Никонов", name: "Артём", middle_name: "Андреевич" },
  { lastname: "Трофимов", name: "Иван", middle_name: "Тимурович" },
  { lastname: "Зиновьев", name: "Платон", middle_name: "Фёдорович" },
  { lastname: "Постникова", name: "Дарья", middle_name: "Артёмовна" },
  { lastname: "Озеров", name: "Даниил", middle_name: "Марсельевич" },
  { lastname: "Алексеев", name: "Вячеслав", middle_name: "Ярославович" },
  { lastname: "Чернова", name: "Екатерина", middle_name: "Руслановна" },
  { lastname: "Зиновьев", name: "Платон", middle_name: "Фёдорович" },
  { lastname: "Зиновьев", name: "Платон", middle_name: "Фёдорович" },
];

function createData(name, lastname, middle_name, university) {
  return { name, lastname, middle_name, university };
}

const userRows = [
  users.map((users) =>
    createData(users.name, users.lastname, users.middle_name, users.university)
  ),
];

export default function BasicTable() {
  return (
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
          {userRows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.lastname}</TableCell>
              <TableCell align="right">{row.middle_name}</TableCell>
              <TableCell align="right">{row.university}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
