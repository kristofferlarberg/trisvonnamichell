import React, { useState, useRef } from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  padding: 1.5rem;
  height: 100%;
  display: flex;
  justify-content: center;
  background-color: white;
`;

function Header(props) {
  return <HeaderContainer>{props.text}</HeaderContainer>;
}

export default Header;
