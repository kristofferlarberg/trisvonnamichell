import React from 'react';
import {RichText} from 'prismic-reactjs';
import styled from 'styled-components';

import {linkResolver} from '../prismic-configuration';

const PageTitle = styled.h1`
  margin: 0;
`;
const HeaderContainer = styled.header`
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

function HomeHeader({information, mobile, fromYear}) {
  return (
    <HeaderContainer mobile={mobile}>
      <PageTitle>
        {`${RichText.asText(information.title)} ${fromYear}–`}
      </PageTitle>
      <RichText
        linkResolver={linkResolver}
        render={information.description}
      />
    </HeaderContainer>
  );
}
export default HomeHeader;
