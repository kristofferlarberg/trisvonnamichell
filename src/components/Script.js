import React from "react";
import styled from "styled-components";

const ScriptBox = styled.section`
  padding: 1.5rem;
  width: 34vw;
  background-color: var(--offwhite);
  position: fixed;
  left: ${(props) => (props.position ? "-30" : "2")}rem;
  transition: ${(props) =>
    props.position ? "all 0.2s ease-out" : "all 0.3s ease-in"};
  max-height: 65vh;
  overflow-y: auto;
`;

function Script(props) {
  return (
    <ScriptBox onClick={props.handleClick} position={props.position}>
      {props.text}
    </ScriptBox>
  );
}

export default Script;