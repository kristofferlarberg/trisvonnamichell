import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

html{
  overflow-y: scroll;
  scroll-behavior: smooth;
  --lightgrey: #969696;
  --offwhite: #fffe;
}

body {
  height:100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "PT-Regular", sans-serif;
  font-size: 1.05rem;
  line-height: 1.6rem;
  background-color: #111;
  background-attachment: fixed;
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-size: cover;
}

h1 {
  font-family: "PT-Regular", sans-serif;
  font-size: 1.6rem;
  font-weight: 400;
  letter-spacing: -0.2px;
}

h2 {
  font-family: "PT-Mono", sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: -0.1px;
}

h3 {
  font-family: "PT-Mono", sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: -0.1px;
}

h4 {
  font-family: "PT-Regular", sans-serif;
  font-size: 0.9rem;
  line-height: 1.4rem;
  color: black;
  margin: 0;
  font-weight: 400;
  line-height: 1.6rem;
}

`;
