import React from 'react';
import styled from 'styled-components';

const NavBar = styled.nav`
  box-sizing: ${props => (props.mobile ? 'content-box' : 'border-box')};
  position: ${props => (!props.renditions || (props.renditions && props.mobile) ? 'static' : 'fixed')};
  top: ${props => props.renditions && '0'};
  height: ${props => (props.makeYearSmall ? '3.5rem' : '5.5rem')};
  width: ${props => (props.renditions ? (props.mobile ? '100%' : 'calc(100% - 4rem)') : '100%')};
  padding: ${props => (props.mobile ? '1rem 0' : '0')};
  display: flex;
  flex-direction: ${props => (props.mobile ? 'column' : 'row')};
  justify-content: ${props => (props.mobile ? 'center' : 'space-between')};
  align-items: center;
  text-align: ${props => (props.mobile ? 'center' : 'left')};
  border-bottom: ${props => props.renditions && '4px solid var(--offwhite)'};
  transition: 0.1s linear;
  padding: ${props => (props.mobile ? '1rem 0' : props.makeYearSmall && '0 2.5rem')};   
  `;

const PageTitle = styled.h1`
  font-size: ${props => props.makeYearSmall && '1.3rem'};
  margin: 0;
  color: var(--offwhite);
  text-align: ${props => props.years && 'right'};
  flex: ${props => props.years && !props.mobile && '0 0 9rem'};
  cursor: pointer;
  transition: 0.1s linear;
  line-height: ${props => props.mobile && '2rem'};
`;

const Title = styled(PageTitle)`
  cursor: default;
`;

function Nav(props) {
    return (
        <NavBar makeYearSmall={ props.makeYearSmall } mobile={ props.mobile } renditions={ props.renditions }>
            { props.renditions ? (
                <Title makeYearSmall={ props.makeYearSmall }>
                    { props.title }
                    { ' ' }
                </Title>
            ) : (
                <PageTitle
                    onClick={ props.toggleTitle }
                    tabIndex={ 0 }
                    role="button"
                    aria-pressed="false"
                    aria-label="Show e-mail adress"
                >
                    { props.title }
                </PageTitle>
            ) }
            <Title makeYearSmall={ props.makeYearSmall }>
                { props.email }
                { ' ' }
            </Title>
            <Title mobile={ props.mobile } years="true" makeYearSmall={ props.makeYearSmall }>
                { props.years }
            </Title>
        </NavBar>
    );
}

export default Nav;
