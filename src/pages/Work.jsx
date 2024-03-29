import React, {useEffect, useState} from 'react';
import Prismic from 'prismic-javascript';
import {RichText} from 'prismic-reactjs';
import styled from 'styled-components';
import {useHistory} from 'react-router-dom';
import {useQuery} from 'react-query';

import {client, linkResolver} from '../prismic-configuration';
import {imgixGreen, imgixOrange} from './Home';
import ButtonFive from '../graphics/5.svg';
import Circle from '../components/Circle';
import Clock from '../components/Clock';
import GlobalStyle from '../styles/global';
import Nav from '../components/Nav';
import NotFound from './NotFound';
import RemoteControl from '../components/RemoteControl';
import RenditionList from '../components/RenditionList';
import Script from '../components/Script';
import Spinner from '../components/Spinner';

const Main = styled.main`
  box-sizing: border-box;
  width: calc(100% - 4rem);
  height: auto;
  max-width: calc(1416px - 4rem);
  margin: 0 2rem 5rem 2rem;
  opacity: ${props => (props.loaded ? '1' : '0')};
  transition: opacity 0.5s ease-in;
  @media (min-width: 1416px) {
    width: calc(1416px - 4rem);
    display: flex;
    justify-content: center;
    margin: 0;
  }
  @media (max-width: 768px) {
    margin: 0;
    width: 100%;
  }
`;

const Content = styled.article`
  box-sizing: border-box;
  margin-top: 8rem;
  height: auto;
  display: flex;
  justify-content: ${props => (props.position ? 'center' : 'flex-end')};
  transition: all 0.3s ease-in;
  @media (max-width: 768px) {
    flex-direction: column;
    align-content: start;
    margin-top: 1rem;
  }
  @media (min-width: 1416px) {
    width: 1416px;
  }
`;

const ListContainer = styled.section`
  padding: 0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in;
  margin-left: ${props => (props.position ? 'calc(50vw - 26rem)' : '40vw')};
  margin-right: ${props => (props.position ? 'calc(50vw - 26rem)' : '0vw')};
  @media (min-width: 1416px) {
    margin-left: ${props => (props.position ? 'calc(708px - 26rem)' : 'calc(100% - 768px)')};
    margin-right: ${props => (props.position ? 'calc(708px - 26rem)' : '0vw')};
  }
  @media (max-width: 900px) {
    margin-left: ${props => (props.position ? 'calc(50vw - 22rem)' : '40vw')};
    margin-right: ${props => (props.position ? 'calc(50vw - 22rem)' : '0vw')};  }
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const DescriptionPreview = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => (props.open ? '1rem' : '1.5rem')};
`;

const Image = styled.img`
  width: 100%;
`;

const StopContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 2px;
  margin: 1.2rem;
  width: 45px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #111;
`;

const StopButton = styled.button`
  width: 35px;
  height: 30px;
  padding: 6px 5px 5px 5px;
  border: 0;
  border-left: 1px solid var(--lightgrey);
  border-right: 1px solid var(--lightgrey);
  background-color: #111;
`;

const StopButtonSymbol = styled.img`
  width: 60%;
  height: auto;
`;

const Work = ({match}) => {
  const [expandValue, setExpandValue] = useState(-1);
  const [toggleScript, toggleScriptState] = useState(true);
  const [openAll, setOpenAll] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const allLoaded = [];
  const [makeYearSmall, setMakeYearSmall] = useState(false);
  const history = useHistory();
  const {uid} = match.params;
  const closedRenditionsRefs = [];
  const openRenditionsRefs = [];
  const [isMobile, setMobile] = useState(window.innerWidth < 768);

  const scaleDownBackground = (imageWidth) => {
    let scaleDownFactor = (window.innerWidth + 100) / imageWidth;
    if (scaleDownFactor > 1) {
      scaleDownFactor = 1;
    }
    return `&w=${Math.round(scaleDownFactor * 100) / 100}`;
  };

  function handleScroll() {
    if (window.pageYOffset > 75) setMakeYearSmall(true);
    else setMakeYearSmall(false);
  }

  const handleResize = () => {
    if (window.innerWidth < 768) setMobile(true);
    else setMobile(false);
  };

  useEffect(() => {
    const functionForOnScroll = () => handleScroll;
    if (!isMobile) {
      window.onscroll = functionForOnScroll();
    }
    window.addEventListener('resize', handleResize);
    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  });

  const getWork = async () => {
    const work = await client.getByUID('work', uid);
    return work;
  };

  const getRenditions = async (workId) => {
    const renditions = await client.query(
      Prismic.Predicates.at('my.rendition.work_category', workId),
    );
    return renditions;
  };

  const calculateScaleDownFactor = (windowWidth, imgWidthPrismic) => {
    let imgWidthInDom = windowWidth;
    if (windowWidth < 900) {
      imgWidthInDom -= 25;
    }
    else {
      imgWidthInDom = 708;
    }
    return Math.round((imgWidthInDom / imgWidthPrismic) * 100) / 100;
  };

  const handleImages = (work) => {
    let numberOfImages = 0;
    const scaleDownFactors = [];
    work.renditions.forEach((rendition, i) => {
      rendition.data.rendition_images.forEach((image) => {
        scaleDownFactors.push([]);
        let factor = calculateScaleDownFactor(window.innerWidth, image.rendition_image.dimensions.width);
        if (isMobile) {
          if (window.innerWidth < 480) factor *= 2;
          else factor *= 1.5;
        }
        if (factor > 1) {
          factor = 1;
        }
        scaleDownFactors[i].push(`&w=${factor}&sharp=30`);
      });
      numberOfImages += rendition.data.rendition_images.length;
    });
    return {numberOfImages, scaleDownFactors};
  };

  async function createWork() {
    const work = await getWork();
    const renditions = await getRenditions(work.id);
    const workCombinedWithRenditions = {
      renditions: renditions.results,
      work,
    };
    const {scaleDownFactors, numberOfImages} = handleImages(workCombinedWithRenditions);
    return {...workCombinedWithRenditions, numberOfImages, scaleDownFactors};
  }

  const {
    data: work, isLoading, isError, isSuccess,
  } = useQuery('work', createWork);

  function executeScroll(ref) {
    let tempRef = 0;
    if (ref !== 0) {
      if (openAll) {
        for (let i = 0; i < ref; i += 1) {
          tempRef += openRenditionsRefs[i];
        }
      }
      else {
        for (let i = 0; i < ref; i += 1) {
          tempRef += closedRenditionsRefs[i];
        }
      }
    }
    setTimeout(
      () => window.scrollTo(0, ref === 0 || ref === -1 ? tempRef : tempRef + 128),
      100,
    );
  }

  function openRendition(v) {
    let value = v;
    const selectedRendition = value + expandValue;
    if (value !== 999 && value !== -2) executeScroll(selectedRendition);
    if (value === 999) {
      setOpenAll(true);
      // value = expandValue > 0 ? -1 : 1
      value = expandValue + 1 === work.renditions.length ? -1 : 1;
      executeScroll(0);
    }
    if (value === -2) {
      setOpenAll(false);
      executeScroll(0);
    }
    setExpandValue(value === -2 ? -1 : value + expandValue);
  }

  function refOpenList(ref) {
    if (openRenditionsRefs.length !== work.renditions.length) openRenditionsRefs.push(ref);
  }

  function refClosedList(ref) {
    if (closedRenditionsRefs.length !== work.renditions.length) closedRenditionsRefs.push(ref);
  }

  function handleLoad() {
    allLoaded.push(true);
    if (allLoaded.length === work.numberOfImages) {
      setTimeout(() => {
        setLoaded(true);
      }, 100);
    }
  }

  if (isError) {
    return <NotFound />;
  }

  if (isLoading) {
    return (<Spinner />);
  }

  if (isSuccess && !work.numberOfImages) {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }

  const workData = work.work.data;
  const imgix = workData.artist === 'Erik' ? imgixOrange : imgixGreen;

  return (
    <>
      <Main loaded={loaded}>
        <GlobalStyle
          img={workData.work_preview_image.url + scaleDownBackground(workData.work_preview_image.dimensions.width) + imgix}
          mobile={isMobile}
        />
        <Nav
          makeYearSmall={makeYearSmall}
          mobile={isMobile}
          renditions
          title={workData.work_title[0].text}
          years={`${workData.work_year_from}–${workData.work_year_to}`}
        />
        <Content position={!toggleScript}>
          <Script
            mobile={isMobile}
            open={!toggleScript}
            position={!toggleScript}
            text={workData.work_script}
            textLength={RichText.asText(workData.work_script).length}
          />
          <ListContainer position={!toggleScript}>
            {work.renditions.map((rendition, j) => (
              <RenditionList
                key={rendition.id}
                descriptionPreview={rendition.data.rendition_images.map(
                  image => (
                    <DescriptionPreview key={image.rendition_image.url}>
                      <Circle />
                      <RichText
                        linkResolver={linkResolver}
                        render={image.rendition_image_caption}
                      />
                    </DescriptionPreview>
                  ),
                )}
                expandValue={expandValue}
                id={j}
                imgAndDescription={rendition.data.rendition_images.map(
                  (image, i) => (
                    <div key={image.rendition_image.url}>
                      <Image
                        alt={image.rendition_image_caption[0].text}
                        onLoad={() => handleLoad()}
                        src={image.rendition_image.url + work.scaleDownFactors[j][i]}
                      />
                      <DescriptionPreview>
                        <RichText
                          linkResolver={linkResolver}
                          render={image.rendition_image_caption}
                        />
                      </DescriptionPreview>
                    </div>
                  ),
                )}
                loaded={loaded}
                mobile={isMobile}
                openAll={openAll}
                refClosedList={refClosedList}
                refOpenList={refOpenList}
                renditionsLength={work.renditions.length}
                title={rendition.data.rendition_title[0].text}
                year={rendition.data.rendition_year}
              />
            ))}
          </ListContainer>
        </Content>
        <Clock mobile={isMobile} />
        {isMobile || (!workData.work_script.length && !workData.renditions) ? (
          <StopContainer>
            <StopButton aria-label="Go back to homepage" onClick={() => history.push('/')} tabIndex={0}>
              <StopButtonSymbol alt="Stop symbol" src={ButtonFive} />
            </StopButton>
          </StopContainer>
        ) : (
          <RemoteControl
            adjustValue={value => openRendition(value)}
            currentValue={expandValue}
            expandAll={openAll}
            renditionsLength={work.renditions.length}
            toggleScriptRemote={() => toggleScriptState(!toggleScript)}
          />
        )}
      </Main>
    </>
  );
};

export default Work;
