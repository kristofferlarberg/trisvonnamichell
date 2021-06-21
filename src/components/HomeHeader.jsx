import React from 'react';
import styled from 'styled-components';

const PageTitle = styled.h1`
  margin: 0;
`;
const HeaderContainer = styled.header`
  position: ${props => (props.hiddenHeader ? 'static' : 'fixed')};;
  visibility: ${props => (props.hiddenHeader ? 'hidden' : 'visible')};
  top: 2rem;
  margin-bottom: 2rem;
  width: ${props => (props.hiddenHeader ? '100%' : 'calc(100% - 4rem)')};
  max-width: 900px;
  color: var(--offwhite);
  z-index: ${props => (!props.hiddenHeader && '-10')};
  @media (max-width: 768px) {
    padding: 0 10px;
    width: ${props => (props.hiddenHeader ? 'calc(100% - 20px)' : 'calc(100% - 30px)')};
    text-align: center;
    margin: ${props => (props.hiddenHeader && '27px 0')};
  }
`;

function HomeHeader({
  fromYear, hiddenHeader, prologue,
}) {
  return (
    <HeaderContainer hiddenHeader={hiddenHeader}>
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
