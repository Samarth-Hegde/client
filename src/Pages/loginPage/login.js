import { Button, InputLabel, TextField, Typography } from "@mui/material";
import "./login.css";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireBaseAuth } from "../../firebase/fireBaseHandler";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function Login() {
  const [userDetails, setUserDetails] = useState({
    email: null,
    password: null,
  });
  const [disable, setDisable] = useState(false);
  const nav = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleClick = (e) => {
    setDisable(true);
    signInWithEmailAndPassword(
      fireBaseAuth,
      userDetails.email,
      userDetails.password
    )
      .then(() => {
        nav("/");
      })
      .catch((err) => {
        alert(err.message);
        setDisable(false);
      });
    setDisable(false);
  };
  return (
    <div className="login-container">
      <Typography
        sx={{ textAlign: "center", marginTop: 7, marginBottom: 15,color: "white" }}
        variant="h4"
      >
        Log In
      </Typography>
      <div className="login-form-container">
        <div className="login-form-elements">
          <InputLabel sx={{ color: "black", marginBottom: "10px" }}>
            Email
          </InputLabel>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </div>
        <div className="login-form-elements">
          <InputLabel sx={{ color: "black", marginBottom: "10px" }}>
            Password
          </InputLabel>
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            sx={{ width: 300 }}
            onChange={handleChange}
          />
        </div>
        <Button
          sx={{ marginBottom: 2 }}
          disabled={disable}
          onClick={handleClick}
          variant="contained"
        >
          Log In
        </Button>
        <Typography variant="h6">
          Do not have an account?
          <Link to="/signup"> Sign Up</Link>
        </Typography>
      </div>
    </div>
  );
}

export default Login;
