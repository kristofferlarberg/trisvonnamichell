import React from "react";
import styled from "styled-components";

const NavBar = styled.nav`
  position: ${(props) =>
    !props.renditions || (props.renditions && props.mobile) ? "static" : "fixed"};
  top: ${(props) => props.renditions && "0"};
  height: 5.5rem;
  width: ${(props) =>
    props.renditions ? (props.mobile ? "100%" : "calc(100% - 4rem)") : "100%"};
  padding: ${(props) => (props.mobile ? "1rem 0" : "0")};
  display: flex;
  flex-direction: ${(props) => (props.mobile ? "column" : "row")};
  justify-content: ${(props) => (props.mobile ? "center" : "space-between")};
  align-items: center;
  text-align: ${(props) => (props.mobile ? "center" : "left")};
  border-bottom: ${(props) => props.renditions && "4px solid var(--offwhite)"};
`;

const PageTitle = styled.h1`
  font-size: ${(props) => props.renditions && "1.3rem"};
  margin: 0;
  color: var(--offwhite);
  text-align: ${(props) => props.years && "right"};
  flex: ${(props) => props.years && !props.mobile && "0 0 9rem"};
  cursor: pointer;
`;

const Title = styled(PageTitle)`
  cursor: default;
`;

function Nav(props) {
  return (
    <NavBar mobile={props.mobile} renditions={props.renditions}>
      {props.renditions ? (
        <Title>{props.title}</Title>
      ) : (
        <PageTitle onClick={props.onClick}>{props.title}</PageTitle>
      )}
      <Title>{props.email}</Title>
      <Title mobile={props.mobile} years={"true"}>
        {props.years}
      </Title>
    </NavBar>
  );
}

export default Nav;
