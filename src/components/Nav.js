import React from "react";
import styled from "styled-components";

const NavBar = styled.nav`
  width: 100%;
  margin: 1rem 0 2rem 0;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: 500px) {
    margin-left: 0rem;
    font-size: 2rem;
    text-align: center;
  }
  @media (max-width: 400px) {
    margin-left: 0rem;
    font-size: 1.6rem;
    text-align: center;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: var(--offwhite);
`;

function Nav(props) {
  return (
    <NavBar>
      <Title>{props.title}</Title>
      <Title>{props.years}</Title>
    </NavBar>
  );
}

export default Nav;
