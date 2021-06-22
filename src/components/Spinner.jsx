import styled, {keyframes} from 'styled-components';
import React from 'react';

// Green #79d163
// Orange #cb8a00

const SpinnerSpinning = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
const SpinnerSpan = styled.span`
  width: 5rem;
  height: 5rem;
  border-top-color: #79d16366;
  border-left-color: #cb8a0066;
  animation: ${SpinnerSpinning} 400ms linear infinite;
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-radius: 50%;  
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
`;

const SpinnerContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 4rem;
`;

function Spinner() {
  return (
    <SpinnerContainer>
      <SpinnerSpan />
    </SpinnerContainer>
  );
}

export default Spinner;
