import React from "react";
import { Link } from "prismic-reactjs";
import { linkResolver } from "../prismic-configuration";
import styled from "styled-components";
import { imgix } from "../pages/Home";

let ua = navigator.userAgent;
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);
const lineHeight = isMobile ? 10 : 17;

const LineContainer = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const Preview = styled.img`
  border-right: 1px solid black;
  border-left: 1px solid black;
  position: relative;
  display: block;
  left: ${(props) => props.width > 0 ? props.left : 0}%;
  width: ${(props) => props.width > 0 ? props.width : "100"}%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
`;
const WorkLink = styled.a`
  position: relative;
  top: ${isMobile ? "0" : -lineHeight}rem;
  height: ${lineHeight}rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: block;
  &:focus-visible {
    outline: none;
    transform: scale(1.05);
  }
`;

const Line = styled.section`
  background-color: transparent;
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: multiply;
  margin-bottom: 5px;
  height: ${lineHeight}rem;
  width: ${isMobile ? "100%" : "90%"};
  transition: background-color 0.3s ease-out;
  &:hover ${Preview} {
    filter: none;
  }
  &:hover {
    background-color: ${!isMobile && '#555'};
    background-blend-mode: ${!isMobile ? 'multiply' : 'normal'};
  }
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

const Timeline = (props) => {

  const scaleDownBackground = () => {
    let scaleDownFactor = (window.innerWidth + 50) / props.work_preview_image_width;
    if (!isMobile) {
      scaleDownFactor *= 0.85;
    }
    if (scaleDownFactor > 1) {
      scaleDownFactor = 1
    }
    return `&w=${Math.round(scaleDownFactor * 100) / 100}`
  }

  const scaleDownPreview = () => {
    let scaleDownFactor = window.innerWidth / props.work_preview_image_width * props.width / 100
    if (scaleDownFactor * props.work_preview_image_height < 300) {
      scaleDownFactor = 300 / props.work_preview_image_height
    }
    if (scaleDownFactor > 1) {
      scaleDownFactor = 1
    }
    return `&w=${Math.round(scaleDownFactor * 100) / 100}&sharp=40`
  };

  return (isMobile ?

    <LineContainer key={props.i + "a"} show={props.loaded}>
      <Line key={props.i + "b"}
        img={props.work_preview_image + scaleDownBackground() + imgix}
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
    </LineContainer >
    :
    <LineContainer key={props.i + "a"} show={props.loaded}>
      <Ends key={props.i + "b"}>
        <VerticalLine />
      </Ends>
      <Line key={props.i + "c"}
        img={props.work_preview_image + scaleDownBackground() + imgix}
      >
        <Preview key={props.i + "c"}
          onLoad={props.handleLoad}
          src={props.work_preview_image + scaleDownPreview()}
          className="link_img"
          alt={props.work_title}
          width={props.width}
          left={props.left}
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

export default Timeline;