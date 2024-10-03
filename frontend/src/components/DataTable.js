import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
const DataTable = () => {
  const [inputValues, setInputValues] = useState({});
  const [existingValues, setExistingValues] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchExistingValues();
  }, []);

  const fetchExistingValues = async () => {
    setLoading(true);
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      window.location.href = "/";
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:5000/existing-values",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setExistingValues(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, value) => {
    setInputValues((prevState) => ({
      ...prevState,
      [id]: parseFloat(value) || 0,
    }));
  };

  const handleSubmitNewValue = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("value", newValue);

      const response = await axios.post(
        "http://localhost:5000/existing-values",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response.data);
      setNewValue("");
      setSuccessMessage("New value added successfully!");
      fetchExistingValues();
    } catch (error) {
      console.error("Error submitting new value:", error);
    }
  };

  // Function to handle deleting a row
  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await axios.delete(`http://localhost:5000/existing-values/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage("Row deleted successfully!");
      fetchExistingValues(); // Refresh the table after deletion
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

  return (
    <Container style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Data Table
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Input Value</TableCell>
                <TableCell>Existing Value</TableCell>
                <TableCell>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {existingValues.map((value) => (
                <TableRow key={value.id}>
                  <TableCell>
                    <TextField
                      type="number"
                      variant="outlined"
                      value={inputValues[value.id] || ""}
                      onChange={(e) =>
                        handleInputChange(value.id, e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{value.value}</TableCell>
                  <TableCell>
                    {inputValues[value.id] && value.value !== 0
                      ? `${(
                          (inputValues[value.id] / value.value) *
                          100
                        ).toFixed(2)}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {/* Delete Icon Button */}
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(value.id)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <form onSubmit={handleSubmitNewValue} style={{ marginTop: "20px" }}>
        <TextField
          label="Add New Value"
          variant="outlined"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default DataTable;
