import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: calc(100% - 8rem);
  height: auto;
  background-color: none;
  display: flex;
  justify-content: space-between;
  border-bottom: 4px solid var(--offwhite);
  margin: 0 4rem 0 4rem;
`;

const WorkTitle = styled.h2`
  width: 100%;
  padding: 1rem 0.3rem;
  margin: 0;
  box-sizing: border-box;
  margin-top: 0;
  text-align: left;
  color: var(--offwhite);
`;

const YearTitle = styled.h2`
  width: 100%;
  padding: 1rem 0.3rem;
  margin: 0;
  box-sizing: border-box;
  margin-top: 0;
  text-align: right;
  color: var(--offwhite);
`;

function Header(props) {
  return (
    <HeaderContainer>
      <WorkTitle>{props.text}</WorkTitle>
      <YearTitle>{props.year}</YearTitle>
    </HeaderContainer>
  );
}

export default Header;
