import React, { useRef, useState, useEffect } from "react";
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
  right: 1rem;
  transition-duration:${props => props.pressed ? "0" : "0.5s"};
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
cursor: move;
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
const Constraint = styled.section`
  position: fixed;
  top: 0;
  width: 100%;
  height: calc(100vh - 3rem);
  z-index: 9;
`

function RemoteControl(props) {

  const {
    expandAll,
    adjustValue,
    currentValue,
    renditionsLength,
    toggleScriptRemote,
  } = props;

  const history = useHistory();
  const [pressed, setPressed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef()

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`
    }
    document.addEventListener("keyup", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keyup", handleKeyDown);
      ;
    };
  });

  const onMouseMove = (event) => {
    if (pressed && event.clientX < window.innerWidth - 30) {
      let x = event.clientX - ref.current.offsetLeft - 14
      let y = event.clientY - ref.current.offsetTop - 34
      setPosition({
        x, y
      })
    }
  }

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
      case 82: setPosition({
        x: 0, y: 0
      })
        break;
      case 84: toggleScript();
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
    return toggleScriptRemote();
  }

  return (
    <Constraint
      onMouseLeave={() => setPressed(false)}
      onMouseMove={pressed ? onMouseMove : undefined}
      onMouseUp={() => setPressed(false)}
    >
      <Container
        pressed={pressed}
        ref={ref}
      >
        <InvisibleButton
          onMouseDown={() => setPressed(true)}
        >
          ::<br />::
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
    </Constraint>
  );
}

export default RemoteControl;
