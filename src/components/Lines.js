import React, { useEffect, useState } from "react";
import { Link } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import Prismic from "prismic-javascript";
import styled from "styled-components";
import { GlobalStyle } from "../styles/global";
import { imgix } from "../pages/Home";

let ua = navigator.userAgent;
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);
const lineHeight = isMobile ? 10 : 17;


const LineContainer = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const Line = styled.section`
  background-color: #454;
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 5px;
  height: ${lineHeight}rem;
  width: ${isMobile ? "100%" : "90%"};
`;

const Preview = styled.img`
  position: relative;
  display: block;
  left: ${(props) => props.width > 0 ? props.left : 0}%;
  width: ${(props) => props.width > 0 ? props.width : "100"}%;
  height: 100%;
  object-fit: cover;
`;

const WorkLink = styled.a`
  position: relative;
  top: ${isMobile ? "0" : -lineHeight}rem;
  height: ${lineHeight}rem;
  text-decoration: none;
  color: inherit;
`;

const HoverLine = styled.section`
  display: flex;
  top: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: ${lineHeight}rem;
  transition-duration: 0.4s;
  &:hover {
    background-color: #ccc8;
  }
`;

const WorkTitle = styled.h2`
  font-size: ${isMobile && "1rem"};
  line-height: ${isMobile && "1.2rem"};
  max-width: 80%;
  margin: 0 0 0.25rem 0;
  padding: ${isMobile ? "4px 8px" : "0.5rem 0.8rem"};
  background-color: var(--offwhite);
  &:last-child {
    margin: 0;
  }
`;

const Ends = styled.section`
  background-color: #000;
  height: ${lineHeight}rem;
  width: 5%;
  min-width: 30px;
  color: var(--lightgrey);
  text-align: center;
  line-height: 0.9rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 15%;
  background-color: var(--lightgrey);
`;

const Lines = (props) => {

    return (isMobile ?

        <LineContainer key={props.i + "a"} show={props.loaded}>
            <Line key={props.i + "b"}
                img={props.work_preview_image}
            >
                <WorkLink key={props.i + "c"}
                    numberOfWorks={props.numberOfWorks}
                    href={Link.url(props.link, linkResolver)}
                >
                    <HoverLine key={props.i + "d"}>
                        <WorkTitle key={props.i + "e"}>
                            {props.work_title}
                        </WorkTitle>
                        <WorkTitle key={props.i + "f"}>
                            {props.work_year_from}–{props.work_year_to}
                        </WorkTitle>
                    </HoverLine>
                </WorkLink>
            </Line>
        </LineContainer>
        :
        <LineContainer key={props.i + "a"} show={props.loaded}>
            <Ends key={props.i + "b"}>
                <VerticalLine />
            </Ends>
            <Line key={props.i + "c"}
                img={props.work_preview_image + imgix}
            >
                <Preview key={props.i + "c"}
                    onLoad={props.handleLoad}
                    src={props.work_preview_image}
                    className="link_img"
                    alt={props.work_title}
                    width={props.width}
                    left={props.left}
                // style={{ "width": `${props.image_width / doc.max_width * 100}%` }}
                />
                <WorkLink key={props.i + "d"}
                    numberOfWorks={props.numberOfWorks}
                    href={Link.url(props.link, linkResolver)}
                >
                    <HoverLine key={props.i + "e"}>
                        <WorkTitle key={props.i + "f"}>
                            {props.work_title}
                        </WorkTitle>
                        <WorkTitle key={props.i + "g"}>
                            {props.work_year_from}–{props.work_year_to}
                        </WorkTitle>
                    </HoverLine>
                </WorkLink>
            </Line>
            <Ends>
                <VerticalLine />
            </Ends>
        </LineContainer >
    )
}

export default Lines