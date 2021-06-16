import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  color: var(--offwhite);
  text-align: left;
  line-height: 1.8rem;
  margin: 3rem 0;
`;
const Description = styled.p`
  color: var(--offwhite);
`;

function HomeHeader({fromYear}) {
  return (
    <HeaderContainer>
      <h1>
        {`Vonna-Michell from ${fromYear}–`}
      </h1>
      <Description>
        Text about Tris Lorem ipsum dolor sit amet consectetur adipisicing elit.
        <br />
        Eveniet quae dolores eaque beatae vel et nisi temporibus quam hic odio laborum eligendi.
        <br />
        Voluptatem ea error animi repudiandae, dicta, totam repellendus!
      </Description>
    </HeaderContainer>
  );
}
export default HomeHeader;
