import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: calc(100% - 12px);
  height: auto;
  background-color: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WorkTitle = styled.h2`
  width: 100%;
  padding: 1rem 1.5rem;
  margin: 4rem;
  box-sizing: border-box;
  margin-top: 0;
  text-align: center;
  color: var(--offwhite);
  border-bottom: 4px solid var(--offwhite);
`;

function Header(props) {
  return (
    <HeaderContainer>
      <WorkTitle>{props.text}</WorkTitle>
    </HeaderContainer>
  );
}

export default Header;
