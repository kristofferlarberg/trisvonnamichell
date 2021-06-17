import React from 'react';
import styled from 'styled-components';

const PageTitle = styled.h1`
  margin: 0;
`;
const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  width: calc(100% - 4rem);
  padding: 0;
  max-width: 900px;
  color: var(--offwhite);
  text-align: left;
  margin: 2rem 0;
  z-index: -10;
  @media (max-width: 768px) {
    width: calc(100% - 30px);
    padding: 0 10px;
    text-align: center;
  }
`;

function HomeHeader({mobile, prologue, fromYear}) {
  return (
    <HeaderContainer mobile={mobile}>
      <PageTitle>
        {`Vonna-Michell from ${fromYear}–`}
      </PageTitle>
      <p>
        {prologue}
      </p>
    </HeaderContainer>
  );
}
export default HomeHeader;
