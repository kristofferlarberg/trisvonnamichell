import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom';
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
  background-color: #111;
  position: fixed;
  bottom: 0;
  right: ${(props) => (props.position ? "1" : "-20")}rem;
  transition: ${(props) =>
    props.position ? "all 0.2s ease-out" : "all 0.3s ease-in"};
`;

const Button = styled.button`
  width: 50px;
  height: 40px;
  border: 0;
  border-left: 1px solid var(--lightgrey);
  background-color: #111;
`;

const LastButton = styled(Button)`
  border-right: 1px solid var(--lightgrey); ;
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
  color: var(--lightgrey);
  &:focus{
    outline: none;
  }
`;

function RemoteControl(props) {

  // const [keyPressed, setKeyPressed] = setState(false);

  const {
    expandAll,
    adjustValue,
    currentValue,
    renditionsLength,
    currentScriptValue,
    toggleScriptRemote,
  } = props;

  const history = useHistory();


  useEffect(() => {
    document.addEventListener("keyup", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keyup", handleKeyDown);
      ;
    };
  });

  function handleKeyDown(event) {
    switch (event.keyCode) {
      case 40: openNext()
        break;
      case 39: openAll()
        break;
      case 37: closeAll()
        break;
      case 38: openPrevious()
        break;
      case 82: props.handleClick()
        break;
      case 84: toggleScript()
        break;
      case 27: history.push('/');
        break;
      default: break;
    }
  }

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
      <InvisibleButton onClick={props.handleClick} position={props.position}>
        ::
        <br />
        ::
      </InvisibleButton>
      <Button onClick={openNext}>
        <ButtonSymbol src={ButtonOne} alt="Open next section" />
      </Button>
      <Button onClick={openPrevious}>
        <ButtonSymbol src={ButtonTwo} alt="Open previous section" />
      </Button>
      <Button onClick={openAll}>
        <ButtonSymbol
          src={!expandAll ? ButtonThreeP : ButtonThree}
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
