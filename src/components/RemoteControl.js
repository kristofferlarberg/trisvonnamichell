import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
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
  const { adjustValue, currentValue, renditionsLength, currentScriptValue, toggleScriptRemote } = props;

  function openNext() {
    if (currentValue < renditionsLength - 1) return adjustValue(1)
  }

  function openPrevious() {
    if (currentValue > -1) return adjustValue(-1)
  }

  function openAll() {
    return adjustValue(renditionsLength * 2 - currentValue);
  }

  function closeAll() {
    return adjustValue(-1 - currentValue);
  }

  function toggleScript() {
    return toggleScriptRemote(!currentScriptValue);
  }

  return (
    <Container>
      <Button onClick={toggleScript}>T</Button>
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
        <Link to="/"><ButtonSymbol src={ButtonFive} alt="Go back to home" /></Link>
      </LastButton>
    </Container>
  );
}

export default RemoteControl;
