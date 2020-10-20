import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const Pixel = styled.div`
  width: 50%;
  height: 2px;
  margin: 0;
  padding: 0;
  background-color: var(--lightgrey);
`;

const PixelLong = styled(Pixel)`
  width: 100%;
`;

const PixelRuler = () => (
  <Container>
    <PixelLong />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <Pixel />
    <PixelLong />
  </Container>
);

export default PixelRuler;
