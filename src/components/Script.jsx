import React, {useEffect, useState} from 'react';
import {RichText} from 'prismic-reactjs';
import styled from 'styled-components';

import {linkResolver} from '../prismic-configuration';

const ScriptBox = styled.section`
  box-sizing: border-box;
  height: ${props => (!props.textLength && '69vh')};
  padding: 0.2rem 1.5rem;
  width: 37vw;
  background-color: var(--offwhite);
  position: fixed;
  left: ${props => (props.position ? '-34vw' : '2rem')};
  transition: ${props => (props.position ? 'all 0.2s ease-out' : 'all 0.3s ease-in')};
  max-height: 69vh;
  overflow-y: auto;
  @media (max-width: 768px) {
    cursor: ns-resize;
    padding: 0 0.9rem;
    position: relative;
    left: 0;
    width: calc(100% - 0.6rem);
    margin: 0 0.3rem 1rem 0.3rem;
    max-height: ${props => (props.openScript ? '1400px' : '175px')};
    overflow-y: hidden;
    ${({openScript}) => !openScript
    && `
      &:after {
      content: "";
      position: absolute;
      left:0;
      bottom: 0;
      height: 50px;
      width: 100%;
      box-shadow: inset 0 -40px 20px var(--offwhite);
      pointer-events: none;
      -webkit-appearance: none;
    }
    `}
  }
  @media (min-width: 1416px) {
    max-width: 33.5rem;
    left: ${props => (props.position ? '-31rem' : 'calc(50% - 708px + 2rem)')};
  }
`;

const AmountContainer = styled.div`
  display: flex;
  justify-content: start;
  margin-bottom: 1rem;
`;

const Amount = styled.h5`
  color: ${props => (!props.lengthyText ? 'var(--lightgrey)' : 'red')};
  margin: 0;
  width: auto;
`;

const Script = ({
  mobile, open, position, text, textLength,
}) => {
  const [openScript, setOpenScript] = useState(text === 'Nothing here...');
  const [lengthyText, setLengthyText] = useState(false);

  useEffect(() => {
    if (textLength > 1000) {
      setLengthyText(true);
    }
  }, [textLength, lengthyText]);

  if (mobile) {
    return (
      <ScriptBox
        aria-label="Toggle between closed or opened script section"
        aria-pressed="false"
        lengthyText={lengthyText}
        onClick={() => mobile && setOpenScript(!openScript) && window.scrollTo(0, 0)}
        openScript={openScript || open}
        position={position}
        role="button"
        tabIndex={0}
        textLength={textLength}
      >
        {textLength ? (
          <>
            <RichText
              linkResolver={linkResolver}
              render={text}
            />
            <AmountContainer>
              <Amount lengthyText={lengthyText}>
                {`${textLength} characters`}
              </Amount>
            </AmountContainer>
          </>
        ) : (
          <p>No content here at the moment.</p>
        )}
      </ScriptBox>
    );
  }

  return (
    <>
      <ScriptBox
        lengthyText={lengthyText}
        position={position}
        textLength={textLength}
      >
        {textLength ? (
          <>
            <RichText
              linkResolver={linkResolver}
              render={text}
            />
            <AmountContainer>
              <Amount lengthyText={lengthyText}>
                {`${textLength} characters`}
              </Amount>
            </AmountContainer>
          </>
        ) : (
          <p>No content here at the moment.</p>
        )}
      </ScriptBox>
    </>
  );
};

export default Script;
