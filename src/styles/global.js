import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`



  html{
    overflow-y: scroll;
    height:100%;
    scroll-behavior: smooth;
    --lightgrey: #969696;
    --offwhite: #fffe;
  }

  body {
    height:100%;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    /* background-color: white; */
    font-family: "Basier Square Regular", sans-serif;
    font-size: 1.05rem;
    line-height: 1.5rem;
    background-color: #111;
    /* background-image: url("graphics/testbg-3.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-blend-mode: darken; */
    background-attachment: fixed;
    background-image: url(${(props) => props.img});
    background-repeat: no-repeat;
    background-size: cover;
  }`;



