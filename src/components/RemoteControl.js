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
  right: ${(props) => (props.position ? "1" : "-20")}rem;
  transition: ${(props) =>
    props.position ? "all 0.2s ease-out" : "all 0.3s ease-in"};
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
const InvisibleButton = styled.button`
font-weight:600;
  position: absolute;
  left:0;
  height: 60px;
  width: 25px;
  border: none;
  background-color: Transparent;
  &:focus{
    outline: none;
  }
`;

function RemoteControl(props) {

  const {
    expandAll,
    adjustValue,
    currentValue,
    renditionsLength,
    currentScriptValue,
    toggleScriptRemote,
  } = props;

  function openNext() {
    if (currentValue < renditionsLength - 1) {
      return adjustValue(1)
    }
  }

  function openPrevious() {
    if (!expandAll && currentValue > -1) return adjustValue(-1);
    if (expandAll && currentValue > 0) return adjustValue(-1);
  }

  function openAll() {
    if (!expandAll) return adjustValue(999);
  }

  function closeAll() {
    return adjustValue(-2);
  }

  function toggleScript() {
    return toggleScriptRemote(!currentScriptValue);
  }

  return (
    <Container position={props.position}>
      <InvisibleButton onClick={props.handleClick} position={props.position}>::<br />::</InvisibleButton>
      <Button onClick={openNext}>
        <ButtonSymbol src={ButtonOne} alt="Open next section" />
      </Button>
      <Button onClick={openPrevious}>
        <ButtonSymbol src={ButtonTwo} alt="Open previous section" />
      </Button>
      <Button onClick={openAll}>
        <ButtonSymbol
          src={
            !expandAll ? ButtonThree : ButtonThreeP
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
