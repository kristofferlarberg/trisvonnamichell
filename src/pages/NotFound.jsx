import {Link} from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

import GlobalStyle from '../styles/global';

const NotFoundContainer = styled.div`
  margin: 1rem 2rem;
  width: 100%;
`;

const NotFoundText = styled.p`
  color: var(--offwhite);
`;

const NotFoundLink = styled(Link)`
  color: var(--offwhite);
  text-align: center;
  width: auto;
  &:visited {
      color: var(--offwhite);
    }
`;

const NotFound = () => (
  <>
    <GlobalStyle />
    <NotFoundContainer>
      <NotFoundText>This document was not found</NotFoundText>
      <NotFoundLink to="/">Return to homepage</NotFoundLink>
    </NotFoundContainer>
  </>
);

export default NotFound;
