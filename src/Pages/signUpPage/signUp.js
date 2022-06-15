import React, { useState, useEffect } from "react";
import "./signUp.css";
import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Typography,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { fireBaseAuth, fireBaseDataBase } from "../../firebase/fireBaseHandler";

function SignUp() {
  const [userDetails, setUserDetails] = useState({
    name: null,
    gender: null,
    phone: null,
    email: null,
    password: null,
    confirmPassword: null,
  });
  const nav = useNavigate();
  const [disable, setDisable] = useState(false);
  const [name, setName] = useState(null);
  const [gender, setGender] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [uid, setUid] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleClick = () => {
    if (validate_form()) {
      setDisable(true);
    }

    if (validate_form()) {
      signUp();
      addToDatabase();
      setDisable(false);
    }
  };

  const addToDatabase = async (e) => {};
  const signUp = () => {
    createUserWithEmailAndPassword(
      fireBaseAuth,
      userDetails.email,
      userDetails.password
    )
      .then(async (data) => {
        const databaseRef = ref(fireBaseDataBase, `users/${data.user.uid}`);
        await set(databaseRef, {
          name: userDetails.name,
          gender: userDetails.gender,
          phone: userDetails.phone,
          email: userDetails.email,
        });
        nav("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const validate_form = () => {
    let flag = true;
    if (!userDetails.name) {
      setName("Please enter your name");
      flag = false;
    } else {
      setName(true);
    }
    if (!userDetails.gender) {
      setGender("Please enter your gender");
      flag = false;
    } else {
      setGender(true);
    }
    if (!userDetails.phone) {
      setPhone("Please enter your phone number");
      flag = false;
    } else {
      setPhone(true);
    }
    if (!userDetails.email) {
      setEmail("Please enter your email");
      flag = false;
    } else {
      setEmail(true);
    }
    if (!userDetails.password) {
      setPassword("Please enter your password");
      flag = false;
    } else if (userDetails.password.length < 9) {
      setPassword("Password must be at least 8 characters long");
      flag = false;
    } else {
      setPassword(true);
    }
    if (!userDetails.confirmPassword) {
      setConfirmPassword("Please confirm your password");
      flag = false;
    } else if (userDetails.password != userDetails.confirmPassword) {
      setConfirmPassword("Passwords do not match");
      flag = false;
    } else {
      setConfirmPassword(true);
    }
    if (flag) {
      return true;
    }
  };

  return (
    <div className="signUp-container">
      <Typography sx={{ textAlign: "center", margin: 5 }} variant="h4">
        Sign Up
      </Typography>
      <div className="signUp-form-container">
        <div className="form-element">
          <InputLabel sx={{ color: "black" }}>Name</InputLabel>
          {name && (
            <Typography sx={{ color: "red" }} variant="h6">
              {name}
            </Typography>
          )}
          <TextField
            sx={{ width: 300, marginBottom: 5 }}
            required={true}
            id="outlined-basic"
            label="Name"
            variant="outlined"
            name="name"
            onChange={handleChange}
          />
        </div>
        <div className="form-element">
          <InputLabel
            sx={{ color: "black" }}
            id="demo-simple-select-helper-label"
          >
            Gender
          </InputLabel>
          {gender && (
            <Typography sx={{ color: "red" }} variant="h6">
              {gender}
            </Typography>
          )}
          <Select
            sx={{ width: 300, marginBottom: 5 }}
            name="gender"
            onChange={handleChange}
          >
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
        </div>
        <div className="form-element">
          <InputLabel sx={{ color: "black" }}>Phone</InputLabel>
          {phone && (
            <Typography sx={{ color: "red" }} variant="h6">
              {phone}
            </Typography>
          )}
          <TextField
            sx={{ width: 300, marginBottom: 5 }}
            required={true}
            id="outlined-basic"
            label="Phone"
            variant="outlined"
            type="number"
            name="phone"
            onChange={handleChange}
          />
        </div>
        <div className="form-element">
          <InputLabel sx={{ color: "black" }}>Email</InputLabel>
          {email && (
            <Typography sx={{ color: "red" }} variant="h6">
              {email}
            </Typography>
          )}
          <TextField
            sx={{ width: 300, marginBottom: 5 }}
            required={true}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            name="email"
            minlength="8"
            type="email"
            onChange={handleChange}
          />
        </div>
        <div className="form-element">
          <InputLabel sx={{ color: "black" }}>Password</InputLabel>
          {password && (
            <Typography sx={{ color: "red" }} variant="h6">
              {password}
            </Typography>
          )}
          <TextField
            sx={{ width: 300, marginBottom: 5 }}
            required={true}
            id="outlined-basic"
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            onChange={handleChange}
          />
        </div>
        <div className="form-element">
          <InputLabel sx={{ color: "black" }}>Confirm Password</InputLabel>
          {confirmPassword && (
            <Typography sx={{ color: "red" }} variant="h6">
              {confirmPassword}
            </Typography>
          )}
          <TextField
            sx={{ width: 300, marginBottom: 5 }}
            required={true}
            name="confirmPassword"
            id="outlined-basic"
            label="Confirm Password"
            type="password"
            variant="outlined"
            onChange={handleChange}
          />
        </div>
        <Button disabled={disable} onClick={handleClick} variant="contained">
          Sign Up
        </Button>
        <Typography variant="h6">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </div>
    </div>
  );
}

export default SignUp;
