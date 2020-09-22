import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ButtonOne from "../graphics/1.svg";
import ButtonTwo from "../graphics/2.svg";
import ButtonThree from "../graphics/3.svg";
import ButtonThreeP from "../graphics/3p.svg";
import ButtonFour from "../graphics/4.svg";
import ButtonFive from "../graphics/5.svg";
import ButtonSix from "../graphics/6.svg";

const Container = styled.div`
  padding: 5px;
  margin: 1rem;
  width: 340px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background-color: grey;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
`;

const Button = styled.button`
  width: 50px;
  height: 40px;
  border: 0;
  border-left: 1px solid black;
  background-color: grey;
`;

const LastButton = styled(Button)`
  border-right: 1px solid black;
`;

const ButtonSymbol = styled.img`
  width: 40%;
  height: auto;
`;

function RemoteControl(props) {
  const {
    adjustValue,
    currentValue,
    renditionsLength,
    currentScriptValue,
    toggleScriptRemote,
  } = props;

  function openNext() {
    if (currentValue < renditionsLength - 1) return adjustValue(1);
  }

  function openPrevious() {
    if (currentValue > -1 && currentValue !== renditionsLength * 2)
      return adjustValue(-1);
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
      <Button onClick={openNext}>
        <ButtonSymbol src={ButtonOne} alt="Open next section" />
      </Button>
      <Button onClick={openPrevious}>
        <ButtonSymbol src={ButtonTwo} alt="Open previous section" />
      </Button>
      <Button onClick={openAll}>
        <ButtonSymbol
          src={
            currentValue !== renditionsLength * 2 ? ButtonThree : ButtonThreeP
          }
          alt="Open all sections"
        />
      </Button>
      <Button onClick={closeAll}>
        <ButtonSymbol src={ButtonFour} alt="Close all sections" />
      </Button>
      <Button onClick={toggleScript}>
        <ButtonSymbol src={ButtonSix} alt="Open/close script" />
      </Button>
      <Link to="/">
        <LastButton>
          <ButtonSymbol src={ButtonFive} alt="Go back to home" />
        </LastButton>
      </Link>
    </Container>
  );
}

export default RemoteControl;
