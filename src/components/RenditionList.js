import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const ListSection = styled.section`
  display: flex;
  flex-direction: column;
  color: #e0e0e0;
`;

const OpenImages = styled.button`
  cursor: pointer;
  padding: 18px;
  display: flex;
  flex-direction: column;
  border: 0;
  border-top: 1px solid white;
  outline: none;
  background-color: #e0e0e0;
`;

const Details = styled.section`
  overflow: hidden;
  transition: max-height 0.6s ease;
`;

const RenditionList = ({ expandValue, rendArray }, props) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState("0px");
  const [expandId, setExpandId] = useState(null);

  const content = useRef(null);

  useEffect(() => {
    setExpandId(expandValue);
    for (let v = 0; v < rendArray.length; v++) {
      if (expandId === rendArray[v]) {
        console.log(expandId);
        setActive(true);
        setHeight(
          active === "active" ? "0px" : `${content.current.scrollHeight}px`
        );
      }
    }
  });
  console.log(active);
  console.log(expandId);
  console.log(rendArray);
  console.log(rendArray[0]);

  /*  function toggleImages(i) {
   
  }
 */
  return (
    <>
      <ListSection>
        <OpenImages>
          {props.title}
          {active === "" ? <>{props.descriptionPreview}</> : null}
        </OpenImages>
        <Details ref={content} style={{ maxHeight: `${setHeight}` }}>
          {props.img}
          {props.description}
        </Details>
      </ListSection>
    </>
  );
};

export default RenditionList;
