import React, { useState, useRef } from "react";
import styled from "styled-components";


const ListSection = styled.section`
  display: flex;
  flex-direction: column;
  color: white;
`;

const OpenImages = styled.button`
  cursor: pointer;
  padding: 18px;
  display: flex;
  flex-direction: column;
  border: 0;
  border-top: 1px solid black;
  outline: none;
  background-color: white;
`;

const Details = styled.section`
  overflow: hidden;
  transition: max-height 0.6s ease;
`;


function RenditionList(props) {

const [setActive, setActiveState] = useState("");
const [setHeight, setHeightState] = useState("0px");

const content = useRef(null);

function toggleImages() {
  setActiveState(setActive === "" ? "active" : "");
   setHeightState(
     setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
   );
}

console.log(setActive);

  return (
    <ListSection onClick={toggleImages}>
      <OpenImages>
        {props.title}
        {props.descriptionOnly}
      </OpenImages>
      <Details ref={content} style={{ maxHeight: `${setHeight}` }}>
        {props.img}
        {props.description}
      </Details>
    </ListSection>
  );
};

export default RenditionList;
