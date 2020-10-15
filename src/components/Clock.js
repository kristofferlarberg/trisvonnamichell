import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 5px;
  margin: 1rem;
  width: 150px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  // background-color: grey;
  position: fixed;
  bottom: 1rem;
  z-index: 1;
  /*   right: ${(props) => (props.position ? "1" : "-20")}rem;
  transition: ${(props) =>
    props.position ? "all 0.2s ease-out" : "all 0.3s ease-in"}; */
`;

const Time = styled.h2`
  width: auto;
  margin: 0;
  text-align: center;
`;

const Buttons = styled.div`
  width: auto;
  height: auto;
`;

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let intervalSecond = null;

    if (active) {
      intervalSecond = setInterval(() => {
        setSeconds(seconds <= 58 ? seconds + 1 : 0);
        if (seconds === 59) {
          setMinutes(minutes <= 58 ? minutes + 1 : 0);
        }
        if (seconds === 59 && minutes === 59) {
          setHours(hours + 1);
        }
      }, 1000);
    } else if (!active && seconds !== 0) {
      clearInterval(intervalSecond);
    }
    setActive(true);
    return () =>
      clearInterval(intervalSecond);
  }, [active, hours, minutes, seconds]);

  return (
    <Container>
      <Time>
        {hours < 10 ? `0${hours}` : hours}:
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </Time>
    </Container>
  );
};

export default Timer;
