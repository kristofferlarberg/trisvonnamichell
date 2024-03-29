import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useHistory} from 'react-router-dom';

import ButtonFive from '../graphics/5.svg';
import ButtonOne from '../graphics/1.svg';
import ButtonSix from '../graphics/6.svg';
import ButtonThree from '../graphics/3.svg';
import ButtonThreeP from '../graphics/3p.svg';
import ButtonTwo from '../graphics/2.svg';

const Constraint = styled.section`
  position: fixed;
  top: 0;
  width: 100%;
  height: calc(100vh - 3rem);
  pointer-events: ${props => (props.overRemote ? 'auto' : 'none')};
  z-index: 9;
  & > div {
    pointer-events: auto;
  }
`;

const Container = styled.div`
  padding: 5px;
  margin: 1rem 2rem;
  padding-right: 15px;
  width: 295px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-radius: 15px;
  background-color: #111;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 9;
  transition: ${props => (props.pressed ? '0' : 'transform 0.25s ease-in')};
`;

const Button = styled.button`
  width: 50px;
  height: 40px;
  padding: 5px 8px;
  border: 0;
  border-left: 1px solid var(--lightgrey);
  background-color: #111;
`;

const LastButton = styled(Button)`
  border-right: 1px solid var(--lightgrey);
`;

const ButtonSymbol = styled.img`
  width: 40%;
  height: auto;
`;

const InvisibleButton = styled.button`
  cursor: move;
  font-weight: 600;
  position: absolute;
  left: 0;
  padding: 5px 17px;
  height: 60px;
  width: 25px;
  border: none;
  background-color: Transparent;
  color: var(--lightgrey);
`;

const RemoteControl = ({
  expandAll,
  adjustValue,
  currentValue,
  renditionsLength,
  toggleScriptRemote,
}) => {
  const history = useHistory();
  const [pressed, setPressed] = useState(false);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [overRemote, setOverRemote] = useState(false);
  const ref = useRef();

  const onMouseMove = (event) => {
    if (pressed && event.clientX < window.innerWidth - 30) {
      const x = event.clientX - ref.current.offsetLeft - 20;
      const y = event.clientY - ref.current.offsetTop - 34;
      setPosition({
        x,
        y,
      });
    }
  };

  function openNext() {
    if (currentValue < renditionsLength - 1) {
      return adjustValue(1);
    }
    return null;
  }

  function openPrevious() {
    if (!expandAll && currentValue > -1) return adjustValue(-1);
    if (expandAll && currentValue > 0) return adjustValue(-1);
    return null;
  }

  function openAll() {
    if (!expandAll) return adjustValue(999);
    if (expandAll) return adjustValue(-2);
    return null;
  }

  function toggleScript() {
    return toggleScriptRemote();
  }

  function handleKeyDown(event) {
    switch (event.keyCode) {
      case 40:
        openNext();
        break;
      case 39:
        openAll();
        break;
      case 37:
        openAll();
        break;
      case 38:
        openPrevious();
        break;
      case 82:
        setPosition({
          x: 0,
          y: 0,
        });
        break;
      case 84:
        toggleScript();
        break;
      case 27:
        history.push('/');
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
    document.addEventListener('keyup', handleKeyDown);
    return function cleanup() {
      document.removeEventListener('keyup', handleKeyDown);
    };
  });

  return (
    <>
      <Constraint
        onMouseLeave={() => {
          setOverRemote(false);
          setPressed(false);
        }}
        onMouseMove={onMouseMove}
        onMouseUp={() => {
          setOverRemote(false);
          setPressed(false);
        }}
        overRemote={overRemote}
      >
        <Container
          ref={ref}
          onMouseLeave={() => !pressed && setOverRemote(false)}
          onMouseOver={() => setOverRemote(true)}
          pressed={pressed}
        >
          <InvisibleButton aria-hidden="true" onMouseDown={() => setPressed(true)} tabIndex={-1}>
            ::
            <br />
            ::
          </InvisibleButton>
          <Button aria-label="Open next section" onClick={openNext}>
            <ButtonSymbol alt="Downwards pointing arrow" src={ButtonOne} />
          </Button>
          <Button aria-label="Open previous section" onClick={openPrevious}>
            <ButtonSymbol alt="Upwards pointing arrow" src={ButtonTwo} />
          </Button>
          <Button aria-label="Open and close all sections" onClick={openAll}>
            <ButtonSymbol
              alt="Downwards pointing fast forward symbol"
              src={!expandAll ? ButtonThreeP : ButtonThree}
            />
          </Button>
          <Button aria-label="Hide or show script section" onClick={toggleScript}>
            <ButtonSymbol alt="Symbol with the letter T" src={ButtonSix} />
          </Button>
          <LastButton aria-label="Go back to homepage" onClick={() => history.push('/')}>
            <ButtonSymbol alt="Stop symbol" src={ButtonFive} />
          </LastButton>
        </Container>
      </Constraint>
    </>
  );
};

export default RemoteControl;
