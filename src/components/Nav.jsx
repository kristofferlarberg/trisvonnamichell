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
    padding: 1rem 0;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    width: 100%;
  }
  `;

const PageTitle = styled.h1`
  font-size: ${props => props.makeYearSmall && '1.3rem'};
  margin: 0;
  color: var(--offwhite);
  text-align: ${props => props.years && 'right'};
  cursor: pointer;
  transition: 0.1s linear;
  @media (max-width: 768px) {
    line-height: 2rem;
  }
`;

const Title = styled(PageTitle)`
  cursor: default;
`;

const OpenInfoBoxButton = styled.button`
`;

function Nav({
  email, makeYearSmall, mobile, renditions, title, toggleTitle, years,
}) {
  return (
    <NavBar makeYearSmall={makeYearSmall} mobile={mobile} renditions={renditions}>
      {renditions ? (
        <Title makeYearSmall={makeYearSmall}>{title}</Title>
      ) : (
        <>
          <PageTitle>
            {toggleTitle ? title : email}
          </PageTitle>
          { /* TODO: Style this button when adding information section */ }
          <OpenInfoBoxButton
            aria-label="Toggle open information section"
            onClick={toggleTitle}
          >
            Info
          </OpenInfoBoxButton>
        </>
      )}
      <Title makeYearSmall={makeYearSmall} mobile={mobile} years="true">
        {years}
      </Title>
    </NavBar>
  );
}

export default Nav;
