import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import FlightCard from "../../Components/FlightCard";
import { Typography, Button, TextField, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./homePage.css";
import { fireBaseAuth, fireBaseDataBase } from "../../firebase/fireBaseHandler";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Homepage() {
  const [flightList, setFlightList] = useState([]);
  const [id, setId] = useState([]);
  const [date, setDate] = useState(null);
  const [name, setName] = useState();
  const nav = useNavigate();
  const handleChange = (e) => {
    setDate(e.target.value);
  };
  const handleLogOut = () => {
    signOut(fireBaseAuth);
  };
  useEffect(() => {
    const dataBaseRef = ref(fireBaseDataBase, `flights`);
    onValue(
      dataBaseRef,
      (snapshot) => {
        setFlightList(Object.values(snapshot.val()));
        setId(Object.keys(snapshot.val()));
      },
      { onlyOnce: true }
    );
    onAuthStateChanged(fireBaseAuth, (user) => {
      if (!user) {
        nav("/login");
      } else {
        const dataBaseRef = ref(fireBaseDataBase, `users/${user.uid}`);
        onValue(dataBaseRef, (snapshot) => {
          setName(snapshot.val().name.split(" ").slice(0, -1).join(" "));
          console.log(name.split(" ").slice(0, -1).join(" "));
        });
      }
    });
  }, [flightList]);

  return (
    <div className="flights-container">
      <div className="header">
        <div className="date">
          <InputLabel sx={{ marginBottom: 1, color: "white" }}>
            Select Date:
          </InputLabel>
          <TextField
            InputProps={{
              inputProps: {
                min: new Date().toISOString().slice(0, 10),
                style: { fontFamily: "Arial", color: "white" },
              },
            }}
            onChange={handleChange}
            name="date"
            type="date"
          ></TextField>
        </div>

        <Typography
          sx={{ textAlign: "center", margin: "50px", color: "white" }}
          variant="h4"
        >
          Hello {name} here is your flight list
        </Typography>
        <Button sx={{ margin: 2 }} variant="contained" onClick={handleLogOut}>
          Log Out
        </Button>
      </div>

      <div className="cards-container">
        {flightList.map((flight, index) => {
          if (date === flight.date) {
            return (
              <FlightCard
                id={id[index]}
                key={id[index]}
                flightDetails={flight}
              ></FlightCard>
            );
          } else if (
            (date && date !== flight.date) ||
            flight.occupancy <= 0 ||
            new Date(flight.date).getDate() < new Date().getDate()
          ) {
            return;
          } else if (date === null) {
            return (
              <FlightCard
                id={id[index]}
                key={id[index]}
                flightDetails={flight}
              ></FlightCard>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Homepage;
