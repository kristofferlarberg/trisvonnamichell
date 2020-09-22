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
  max-height: ${props => props.height};
`;

const PreviewDiv = styled.div`
  max-height: ${props => props.height2};
  overflow: hidden;
  transition: 0.6s ease;
`;

const RenditionList = (props) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState("0px");
  const [height2, setHeight2] = useState("0px");
  const content = useRef(null);
  const content2 = useRef(null);

  useEffect(() => {
    setActive(false);
    if (props.expandValue === props.renditionsLength * 2) setActive(true);
    if (props.expandValue === props.id) setActive(true);

    setHeight(
      active === false ? "0px" : `${content.current.scrollHeight}px`
    );
    setHeight2(
      active === true ? "0px" : `${content2.current.scrollHeight}px`
    );
  }, [props.renditionsLength, props.expandValue, props.id, active]
  );

  return (
    <>
      <ListSection>
        <OpenImages>
          {props.title}
          <PreviewDiv ref={content2} height2={height2}>
            {props.descriptionPreview}
          </PreviewDiv>
        </OpenImages>
        <Details ref={content} height={height}>
          {props.img}
          {props.description}
        </Details>
      </ListSection>
    </>
  );
};

export default RenditionList;
