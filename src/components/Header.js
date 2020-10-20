import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  padding: 2rem 0.5rem 2rem 0.5rem;
  width: calc(100% - 4rem);
  height: auto;
  background-color: none;
  display: flex;
  justify-content: space-between;
  border-bottom: 4px solid var(--offwhite);
`;

const WorkTitle = styled.h2`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  text-align: left;
  color: var(--offwhite);
`;

const YearTitle = styled(WorkTitle)`
  text-align: right;
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
