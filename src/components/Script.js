import React from "react";
import styled from "styled-components";

const ScriptBox = styled.section`
  padding: 1.5rem;
  width: 30vw;
  background-color: white;
  position: fixed;
  left: ${(props) => (props.position ? "-30" : "4")}vw;
  transition: ${(props) =>
    props.position ? "all 0.2s ease-out" : "all 0.3s ease-in"};
`;
// position: ${ props => props.position ? "relative" : "absolute" };

function Script(props) {
  return (
    <ScriptBox onClick={props.handleClick} position={props.position}>
      {props.text}
    </ScriptBox>
  );
}

export default Script;
