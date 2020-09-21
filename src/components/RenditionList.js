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

const RenditionList = (props) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState("0px");
  const content = useRef(null);

  useEffect(() => {
    setActive(false);
    if (props.expandValue === 1000) setActive(true);
    if (props.expandValue === props.id) setActive(true);
    // console.log("propsid:" + props.id)
    // console.log("expandvalue:" + props.expandValue)
    // console.log("active:" + active)
    // console.log("-----------------------")

    setHeight(
      active === true ? "0px" : `${content.current.scrollHeight}px`
    );
  }, [props.expandValue, props.id, active]
  );

  return (
    <>
      <ListSection>
        <OpenImages>
          {props.title}
          {!active ? <>{props.descriptionPreview}</> : null}
        </OpenImages>
        <Details ref={content} style={{ maxHeight: `${setHeight}` }}>
          {active ? props.img : null}
          {props.description}
        </Details>
      </ListSection>
    </>
  );
};

export default RenditionList;
