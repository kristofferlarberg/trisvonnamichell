import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  //padding: 2rem 0 2rem 0;
  width: calc(100% - 4rem);
  height: 5.5rem;
  background-color: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid var(--offwhite);
`;

const WorkTitle = styled.h2`
  // width: 60%;
  box-sizing: border-box;
  margin: 0;
  text-align: left;
  color: var(--offwhite);
`;

const YearTitle = styled(WorkTitle)`
  width: 12rem;  
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
