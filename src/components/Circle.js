import React from "react";
import styled from "styled-components";


const CircleStyle = styled.svg`
  fill: var(--lightgrey);
  width: 20px;
  height: 20px;
  margin-top: 0.2rem;
`;

const CircleStyle2 = styled(CircleStyle)`
  fill: black;
  width: 20px;
  height: 20px;
  margin-top: 0.43rem;
  margin-right: 0.2rem;
`;

export const GreyCircle = () => (
  <CircleStyle viewBox="0 0 20 20">
    <path d="M4.4,8.8A4.4,4.4,0,1,1,8.8,4.4,4.41,4.41,0,0,1,4.4,8.8Z" />
  </CircleStyle>
);

export const BlackCircle = () => (
  <CircleStyle2 /* viewBox="0 0 15 15" */>
    <path d="M4.4,8.8A4.4,4.4,0,1,1,8.8,4.4,4.41,4.41,0,0,1,4.4,8.8Zm0-7.48A3.08,3.08,0,1,0,7.47,4.4,3.08,3.08,0,0,0,4.4,1.32Z" />
  </CircleStyle2>
);
