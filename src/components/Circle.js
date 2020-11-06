import React from "react";
import styled from "styled-components";


const CircleStyle = styled.svg`
  fill: black;
  width: 20px;
  height: 20px;
  margin-top: 0.54rem;
`;

export const Circle = () => (
  <CircleStyle /* viewBox="0 0 20
   20" */>
    <path d="M4.4,8.8A4.4,4.4,0,1,1,8.8,4.4,4.41,4.41,0,0,1,4.4,8.8Z" />
  </CircleStyle>
);
