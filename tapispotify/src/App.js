import { useEffect, useState } from "react";
import "./styles.css";
import React from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";

//const base_url = "http://35.174.123.227:3001";
const base_url = "http://localhost:3001";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedin");

    if (isLoggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <React.Fragment>
      {isLoggedIn && <Home />}
      {!isLoggedIn && <Login />}
    </React.Fragment>
  );
}

//https://stackoverflow.com/questions/32378953/keep-the-middle-item-centered-when-side-items-have-different-widths
//https://www.freecodecamp.org/news/how-to-persist-a-logged-in-user-in-react/
//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
