import React, { useState } from 'react';
import styled from 'styled-components';

const ScriptBox = styled.section`
  box-sizing: border-box;
  padding: 0.9rem 1.5rem 1.5rem 1.5rem;
  width: 37vw;
  background-color: var(--offwhite);
  position: fixed;
  left: ${props => (props.position ? '-34vw' : '2rem')};
  transition: ${props => (props.position ? 'all 0.2s ease-out' : 'all 0.3s ease-in')};
  max-height: 69vh;
  overflow-y: auto;
  @media (max-width: 900px) {
    cursor: ns-resize;
    padding: 0 0.9rem;
    position: relative;
    left: 0;
    width: calc(100% - 0.6rem);
    margin: 0 0.3rem 1rem 0.3rem;
    max-height: ${props => (props.openScript ? 'none' : '175px')};
    overflow-y: hidden;
    ${({ openScript }) => !openScript
    && `
      &:after {
      content: "";
      position: absolute;
      left:0;
      bottom: 0;
      height: 50px;
      width: 100%;
      box-shadow: inset 0 -40px 20px var(--offwhite);
      pointer-events: none;
      -webkit-appearance: none;
    }
    `}
  }
`;

function Script(props) {
    const [openScript, setOpenScript] = useState(false);

    return (
        <ScriptBox
            openScript={ openScript || props.open }
            onClick={ () => {
                props.mobile && setOpenScript(!openScript);
                props.mobile && window.scrollTo(0, 0);
            } }
            position={ props.position }
            role="button"
            aria-pressed="false"
            aria-label="Expand script section"
            tabIndex={ 1 }
        >
            { props.text }
        </ScriptBox>
    );
}

export default Script;
