import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ref, set, onValue } from "firebase/database";
import "./FlightCard.css";
import { fireBaseAuth, fireBaseDataBase } from "../firebase/fireBaseHandler";
import { onAuthStateChanged } from "firebase/auth";

function FlightCard(props) {
  const [uid, setUid] = useState();
  const [userData, setUserData] = useState();
  const handleClick = async () => {
    addTicket();
    const usersRef = ref(
      fireBaseDataBase,
      `flights/${props.id}/passengers/${uid}`
    );
    onValue(
      usersRef,
      async (snapshot) => {
        setUserData(snapshot.val());
      },
      { onlyOnce: false }
    );
    if (userData && "count" in userData) {
      const countRef = ref(
        fireBaseDataBase,
        `flights/${props.id}/passengers/${uid}/count`
      );
      await set(countRef, parseInt(userData.count) + 1);
      onValue(
        usersRef,
        async (snapshot) => {
          alert(` ${snapshot.val().count} tickets booked for this flight`);
        },
        { onlyOnce: true }
      );
    } else {
      await set(usersRef, { ...userData, count: 1 });
      onValue(
        usersRef,
        async (snapshot) => {
          alert(
            ` ${
              snapshot.val().count
            } tickets booked for this flight`
          );
        },
        { onlyOnce: true }
      );
    }
    const dataBaseRef = ref(fireBaseDataBase, `flights/${props.id}`);
    onValue(
      dataBaseRef,
      async (snapshot) => {
        const occRef = ref(fireBaseDataBase, `flights/${props.id}/occupancy`);
        await set(occRef, parseInt(snapshot.val().occupancy) - 1);
      },
      { onlyOnce: true }
    );
  };

  const addTicket = async () => {
    const getUserRef = ref(fireBaseDataBase, `users/${uid}`);
    onValue(getUserRef, async (snapshot) => {
      const setUserRef = ref(
        fireBaseDataBase,
        `flights/${props.id}/passengers/${uid}`
      );
      await set(setUserRef, snapshot.val());
    });
  };

  useEffect(() => {
    onAuthStateChanged(fireBaseAuth, async (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
  }, []);

  return (
    <Card sx={{ maxWidth: "100vw", margin: 5 }}>
      <CardContent>
        <Typography
          sx={{ color: "#0b8f2c" }}
          gutterBottom
          variant="h3"
          component="div"
        >
          {props.flightDetails.airline}
        </Typography>
        <div className="sec">
          <Typography sx={{ color: "rebeccapurple" }} variant="h5">
            Date :
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {props.flightDetails.date}
          </Typography>
        </div>
        <div className="sec">
          <Typography sx={{ color: "rebeccapurple" }} variant="h5">
            Arrival :
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {props.flightDetails.arrTime}
          </Typography>
        </div>
        <div className="sec">
          <Typography sx={{ color: "rebeccapurple" }} variant="h5">
            Departure :
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {props.flightDetails.depTime}
          </Typography>
        </div>
        <div className="sec">
          <Typography sx={{ color: "rebeccapurple" }} variant="h5">
            Boarding Point :
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {props.flightDetails.brdPoint}
          </Typography>
        </div>
        <div className="sec">
          <Typography sx={{ color: "rebeccapurple" }} variant="h5">
            Destination :
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {props.flightDetails.destination}
          </Typography>
        </div>
        <div className="sec">
          <Typography sx={{ color: "rebeccapurple" }} variant="h5">
            Cost :
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            ₹ {props.flightDetails.cost}
          </Typography>
        </div>
        <Button onClick={handleClick} variant="contained">
          Book
        </Button>
      </CardContent>
    </Card>
  );
}

export default FlightCard;
