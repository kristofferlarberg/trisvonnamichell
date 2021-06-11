import {Link} from 'react-router-dom';
import React from 'react';

import GlobalStyle from '../styles/global';

const notFoundStyle = {
  alignItems: 'center',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  height: '50vh',
  justifyContent: 'center',
};

const notFoundLinkStyle = {
  color: 'white',
};

const NotFound = () => (
  <div className="not-found" style={notFoundStyle}>
    <GlobalStyle />
    <h1>404</h1>
    <h2>Document not found</h2>
    <p>
      <Link style={notFoundLinkStyle} to="/">Return to homepage</Link>
    </p>
  </div>
);

export default NotFound;
