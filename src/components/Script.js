import React, { useState, useRef } from "react";
import styled from "styled-components";

const ScriptBox = styled.section`
  padding: 1.5rem;
  width: 30vw;
  background-color: #fcff7e;
  position: fixed;
  padding-left:4vw;
  left: ${props => props.position ? "-33" : "0"}vw;
  transition: ${props => props.position ? "all 0.5s ease-out" : "all 0.5s ease-in"};
  
`;
// position: ${ props => props.position ? "relative" : "absolute" };


function Script(props) {


  return <ScriptBox onClick={props.handleClick} position={props.position}>{props.text}</ScriptBox>;
}

export default Script;
