import React, { useState, useRef } from "react";
import styled from "styled-components";

const ScriptBox = styled.section`
  margin-left: 4rem;
  padding: 1.5rem;
  width: 30vw;
  height: 100%;
  background-color: #fcff7e;
`;

function Script(props) {
  return <ScriptBox>{props.text}</ScriptBox>;
}

export default Script;
