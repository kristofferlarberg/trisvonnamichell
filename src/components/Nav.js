import React from "react";
import styled from "styled-components";

const NavBar = styled.nav`
  position: ${(props) => props.renditions ? "fixed" : "static"};
  top:${(props) => props.renditions && "0"};
  height: 5.5rem;
  width: ${(props) => props.renditions ? "calc(100% - 4rem)" : "100%"};
  display: flex;
  flex-direction: ${(props) => props.mobile ? "column" : "row"};
  justify-content: space-between;
  align-items: center;
  text-align: ${(props) => props.mobile ? "center" : "left"};
  border-bottom: ${(props) => props.renditions && "4px solid var(--offwhite)"};
`;

const Title = styled.h2`
  margin: 0;
  color: var(--offwhite);
`;

function Nav(props) {
  return (
    <NavBar mobile={props.mobile} renditions={props.renditions}>
      <Title>{props.title}</Title>
      <Title>{props.years}</Title>
    </NavBar>
  );
}

export default Nav;