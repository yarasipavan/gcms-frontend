import React, { useEffect } from "react";
import banner from "../../images/banner.jpg";
import HomeAbout from "./homeAbout/HomeAbout";
import HomeCarousel from "./homeCarousel/HomeCarousel";
import TopNavBar from "../topNavBar/TopNavBar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let { status, user } = useSelector((store) => store.login);
  let navigate = useNavigate();
  useEffect(() => {
    if (status === "success") {
      if (user?.role === "admin") navigate("/admin");
      else if (user?.role === "occupant") {
        navigate("/occupant");
      } else if (user?.role === "security") {
        navigate("/security");
      }
    }
    console.log("******", user, status);
  }, [status]);
  if (user)
    return (
      <>
        <TopNavBar />
        <div>
          <img src={banner} alt="building" width={"100%"} height={600}></img>
        </div>
        <HomeAbout />
        <HomeCarousel />
      </>
    );
};

export default Home;
