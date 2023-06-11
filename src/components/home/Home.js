import React from "react";
import banner from "../../images/banner.jpg";
import HomeAbout from "./homeAbout/HomeAbout";
import HomeCarousel from "./homeCarousel/HomeCarousel";
import TopNavBar from "../topNavBar/TopNavBar";

const Home = () => {
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
