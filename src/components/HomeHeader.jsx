import React from 'react';
import styled from 'styled-components';

const PageTitle = styled.h1`
  margin: 0;
`;
const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  width: ${props => (props.mobile ? 'calc(100% - 30px)' : 'calc(100% - 4rem)')};
  padding: ${props => (props.mobile ? '0 10px' : '0')};
  max-width: 900px;
  color: var(--offwhite);
  text-align: ${props => (props.mobile ? 'center' : 'left')};
  margin: 2rem 0;
  z-index: -10;
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
