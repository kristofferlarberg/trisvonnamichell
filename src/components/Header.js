import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  height: auto;
  display: flex;
  justify-content: center;
  background-color: none;
  display: flex;
  align-items: center;
`;

const WorkTitle = styled.h2`
  padding: 1rem 1.5rem;
  margin-bottom: 4rem;
  margin-top: 4rem;
  background-color: white;
`;


function Header(props) {
  return (
    <HeaderContainer>
      <WorkTitle>{props.text}</WorkTitle>
    </HeaderContainer>
  );
}

export default Header;
