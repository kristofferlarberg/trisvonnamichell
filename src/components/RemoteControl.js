import React, { useState } from "react";
import styled from "styled-components";

import ButtonOne from "../graphics/1.svg";
import ButtonTwo from "../graphics/2.svg";
import ButtonThree from "../graphics/3.svg";
import ButtonFour from "../graphics/4.svg";
import ButtonFive from "../graphics/5.svg";

const Container = styled.div`
  padding: 5px;
  margin: 1rem;
  width: 500px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  background-color: grey;
`;

const Button = styled.button`
  width: 70px;
  height: 70px;
  border: 0;
  border-left: 1px solid black;
  background-color: grey;
`;

const LastButton = styled.button`
  width: 70px;
  height: 70px;
  border: 0;
  border-left: 1px solid black;
  border-right: 1px solid black;
  background-color: grey;
`;

const ButtonSymbol = styled.img`
  width: 40%;
  height: auto;
`;

function RemoteControl(props) {
  const [value, setValue] = useState(0);
  const adjustValue = props.adjustValue;


  function openNext() {
    // if (value === null) {
    //   setValue(0);
    //   console.log("VALUE:" + value)

    //   return adjustValue(value);
    // }
    if (value !== 1000 && value < props.renditionLength) {
      setValue(value + 1);
      console.log("VALUE:" + value)

      return adjustValue(value);
    }
  }

  function openPrevious() {

    if (value === -1) {
      setValue(null);
      console.log("VALUE:" + value)

      return adjustValue(value);

    }
    if (value !== 1000 && value >= 0) {
      console.log("VALUE:" + value)
      setValue(value - 1);
      return adjustValue(value);
    }
  }

  function openAll() {
    setValue(1000);
    return adjustValue(value);
  }

  function closeAll() {
    setValue(null);
    return adjustValue(value);
  }

  return (
    <Container>
      <Button>T</Button>
      <Button onClick={openNext}>
        <ButtonSymbol src={ButtonOne} alt="Open next section" />
      </Button>
      <Button onClick={openPrevious}>
        <ButtonSymbol src={ButtonTwo} alt="Open previous section" />
      </Button>
      <Button onClick={openAll}>
        <ButtonSymbol src={ButtonThree} alt="Open all sections" />
      </Button>
      <Button onClick={closeAll}>
        <ButtonSymbol src={ButtonFour} alt="Close all sections" />
      </Button>
      <LastButton>
        <ButtonSymbol src={ButtonFive} alt="Go back to home" />
      </LastButton>
    </Container>
  );
}

export default RemoteControl;
