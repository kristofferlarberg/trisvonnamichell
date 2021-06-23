import React from 'react';
import styled from 'styled-components';

const NavBar = styled.nav`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  height: ${props => (props.makeYearSmall ? '3.5rem' : '5.5rem')};
  width: calc(100% - 4rem);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  border-bottom: 4px solid var(--offwhite);
  transition: 0.1s linear;
  padding: ${props => (props.makeYearSmall ? '0 2.5rem' : '0')}; 
  @media (min-width: 1416px) {
    width: calc(1416px - 4rem);
  }
  @media (max-width: 768px) {
    position: static;
    box-sizing: content-box;
    padding: 1rem 10px;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    width: calc(100% - 20px);
  }
`;

const PageTitle = styled.h1`
  font-size: ${props => props.makeYearSmall && '1.3rem'};
  margin: 0;
  color: var(--offwhite);
  text-align: ${props => props.years && 'right'};
  transition: 0.1s linear;
  @media (max-width: 768px) {
    line-height: 2rem;
  }
`;

function Nav({
  makeYearSmall, mobile, renditions, title, years,
}) {
  return (
    <NavBar makeYearSmall={makeYearSmall} mobile={mobile} renditions={renditions}>
      <PageTitle makeYearSmall={makeYearSmall}>{title}</PageTitle>
      <PageTitle makeYearSmall={makeYearSmall} mobile={mobile} years="true">
        {years}
      </PageTitle>
    </NavBar>
  );
}

export default Nav;
