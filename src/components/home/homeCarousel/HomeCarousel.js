import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import TwoBhk1 from "../../../images/2bhk1.jpg";
import TwoBhk2 from "../../../images/2bhk2.jpg";
import ThreeBhk1 from "../../../images/3bhk01.jpg";

const HomeCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      variant="dark"
      activeIndex={index}
      onSelect={handleSelect}
      className="w-75 mx-auto mb-3 mt-3"
    >
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={TwoBhk1}
          alt="2 BHK"
          height={600}
          width={200}
        />
        <Carousel.Caption>
          <h3>2 B H K</h3>
          <p>ndshjsk</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={TwoBhk2}
          alt="2 B H K"
          height={600}
          width={200}
        />

        <Carousel.Caption>
          <h3>2 B H K</h3>
          <p>dfndsm</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={ThreeBhk1}
          alt="3 B H K"
          height={600}
          width={200}
        />

        <Carousel.Caption>
          <h3>3 B H K</h3>
          <p>dfgdfsfgrfdsf</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default HomeCarousel;
