import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getAllInstitutes } from "../Http/InstituteAPI";
import Table from "react-bootstrap/Table";

const InstitutesPage = () => {
  const [institutes, setInstitutes] = useState([]);
  const [inputData, setInputData] = useState("");
  const [sheetData, setSheetData] = useState(getAllInstitutes());
  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };
  useEffect(() => {
    fetch("http://localhost:4000/institute/getall")
      .then((response) => response.json())
      .then((data) => setInstitutes(data));
  }, []);
  const handleAddData = () => {
    setSheetData([...sheetData, inputData]);
  };

  const handleSortByCoincidence = () => {
    const sortedData = [...sheetData].sort((a, b) => {
      const aCoincidence = a
        .split("")
        .filter((char) => char === inputData).length;
      const bCoincidence = b
        .split("")
        .filter((char) => char === inputData).length;
      return bCoincidence - aCoincidence;
    });
    setSheetData(sortedData);
  };

  return (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {institutes.map((institute) => (
            <td>
              <h2>{institute.institute_name}</h2>
              <p>{institute.location}</p>
            </td>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default InstitutesPage;
