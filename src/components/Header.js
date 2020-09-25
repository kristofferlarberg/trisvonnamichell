import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width:100vw;
  height: auto;
  display: flex;
  justify-content: center;
  background-color: none;
  display: flex;
  align-items: center;
`;

const WorkTitle = styled.h2`
  text-align: center;
  padding: 1rem 1.5rem;
  margin-bottom: 4rem;
  margin-top: 0;
  background-color: white;
  width: 100%;
`;


function Header(props) {
  return (
    <HeaderContainer>
      <WorkTitle>{props.text}</WorkTitle>
    </HeaderContainer>
  );
}

export default Header;
