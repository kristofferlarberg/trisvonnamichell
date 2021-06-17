import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

const ListSection = styled.div`
  padding: ${props => (props.mobile ? '0.9rem' : '2rem')};
  display: flex;
  flex-direction: column;
  background-color: var(--offwhite);
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: ${props => props.mobile && '82px'};
  }
  @media (max-width: 768px) {
    margin: 0 0.3rem 1rem 0.3rem;
  }
`;

const OpenImages = styled.section`
  display: flex;
  flex-direction: column;
  border: 0;
  outline: none;
`;

const TitleContainer = styled.header`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0;
`;

const Details = styled.section`
  overflow: hidden;
  transition: max-height 0.3s ease;
  max-height: ${props => props.height};
`;

const PreviewDiv = styled.div`
  height: ${props => props.height2};
  transition: 0.6s ease;
  overflow: hidden;
`;

const RenditionList = ({
  descriptionPreview, expandValue, id, imgAndDescription, loaded, mobile, openAll, refClosedList, refOpenList, renditionsLength, title, year,
}) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState('0px');
  const [height2, setHeight2] = useState('0px');
  /* const [propDependency, setPropDependency] = useState([props.renditionsLength, props.expandValue, props.loaded, props.id, active]) */
  const content = useRef(null);
  const content2 = useRef(null);

  useEffect(() => {
    refClosedList(content2.current.scrollHeight);
    refOpenList(content.current.scrollHeight);
    setActive(false);
    if (openAll || expandValue === id || mobile) setActive(true);
    setHeight(active === false ? '0px' : `${content.current.scrollHeight}px`);
    setHeight2(
      active === true && loaded ? '0px' : `${content2.current.scrollHeight}px`,
    );
  }, [
    renditionsLength,
    expandValue,
    loaded,
    id,
    active,
    mobile,
    openAll,
    refClosedList,
    refOpenList,
  ]);

  return (
    <ListSection mobile={mobile}>
      <OpenImages>
        <TitleContainer>
          <Title>{title}</Title>
          <Title>{year}</Title>
        </TitleContainer>
        <PreviewDiv ref={content2} aria-label="Open sections with buttons further down to read images" height2={height2}>
          {descriptionPreview}
        </PreviewDiv>
      </OpenImages>
      <Details ref={content} height={height}>
        {imgAndDescription}
      </Details>
    </ListSection>
  );
};

export default RenditionList;
