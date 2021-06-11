import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { RichText } from "prismic-reactjs";
import { apiEndpoint, client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";
import { GlobalStyle } from "../styles/global";
import RenditionList from "../components/RenditionList";
import Script from "../components/Script";
import RemoteControl from "../components/RemoteControl";
import NewClock from "../components/NewClock";
import { imgix } from "./Home";
import { Circle } from "../components/Circle";
import Nav from "../components/Nav";
import ButtonFive from "../graphics/5.svg";
import { useQuery } from 'react-query'

let ua = navigator.userAgent;
export const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);

const Main = styled.main`
  box-sizing: border-box;
  width: ${isMobile ? "100%" : "calc(100% - 4rem)"};
  height: auto;
  max-width: calc(1440px - 4rem);
  margin: ${isMobile ? "0" : "0 2rem 5rem 2rem"};
  opacity: ${(props) => (props.loaded ? "1" : "0")};
  transition: opacity 0.5s ease-in;
  @media (min-width: 1440px) {
    display: flex;
    justify-content: center;
    margin: 0;
  }
`;

const Loading = styled.p`
  color: #fff;
  margin: 32px 0 0 32px;
  font-family: "PT-Regular", sans-serif;
  font-size: 1.05rem;
`;

const Content = styled.article`
  box-sizing: border-box;
  margin-top: ${isMobile ? "1rem" : "8rem"};
  height: auto;
  display: flex;
  justify-content: ${(props) => (props.position ? "center" : "flex-end")};
  transition: all 0.3s ease-in;
  @media (max-width: 900px) {
    flex-direction: column;
    align-content: start;
  }
  @media (min-width: 1440px) {
    width: 1440px;
  }
`;

const ListContainer = styled.section`
  padding: 0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in;
  margin-left: ${(props) => (props.position ? "calc(720px - 26rem)" : "40vw")};
  margin-right: ${(props) => (props.position ? "calc(720px - 26rem)" : "0vw")};
  @media (max-width: 1440px) {
    margin-left: ${(props) => (props.position ? "calc(50vw - 26rem)" : "40vw")};
    margin-right: ${(props) => (props.position ? "calc(50vw - 26rem)" : "0vw")};
  }
  @media (max-width: 900px) {
    margin: 0;
  }
`;

const DescriptionPreview = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${(props) => (props.open ? "1rem" : "1.5rem")};
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

const Renditions = ({ match }) => {
  const [expandValue, setExpandValue] = useState(-1);
  const [toggleScript, toggleScriptState] = useState(true);
  const [openAll, setOpenAll] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const allLoaded = [];
  const [makeYearSmall, setMakeYearSmall] = useState(false);
  const history = useHistory();
  const uid = match.params.uid;
  let closedRenditionsRefs = [];
  let openRenditionsRefs = [];

  const scaleDownBackground = (imageWidth) => {
    let scaleDownFactor = (window.innerWidth + 100) / imageWidth;
    if (scaleDownFactor > 1) {
      scaleDownFactor = 1
    }
    return `&w=${Math.round(scaleDownFactor * 100) / 100}`
  }

  useEffect(() => {
    if (!isMobile) {
      window.onscroll = function () { handleScroll() }
    };
  }, [uid]); // Skip the Effect hook if the UID hasn't changed

  const getWork = async () => {
    return await client.getByUID('work', uid);
  };

  const getRenditions = async (workId) => {
    return await client.query(
      Prismic.Predicates.at("my.rendition.work_category", workId)
    );
  }

  async function createWork() {
    const work = await getWork()
    const renditions = await getRenditions(work.id);
    const workCombinedWithRenditions = {
      renditions: renditions.results,
      work_script: work.data.work_script,
      work_title: work.data.work_title,
      work_year_from: work.data.work_year_from,
      work_year_to: work.data.work_year_to,
      work_image: work.data.work_preview_image.url,
      work_image_width: work.data.work_preview_image.dimensions.width
    };
    const { scaleDownFactors, numberOfImages } = handleImages(workCombinedWithRenditions);
    return { ...workCombinedWithRenditions, scaleDownFactors, numberOfImages }
  }

  const { data: work, isLoading, isError } = useQuery("work", createWork);

  const handleImages = (work) => {
    let numberOfImages = 0;
    let scaleDownFactors = []
    work.renditions.forEach((rendition, i) => {
      rendition.data.rendition_images.forEach(image => {
        scaleDownFactors.push([])
        let factor = calculateScaleDownFactor(window.innerWidth, image.rendition_image.dimensions.width);
        if (isMobile) {
          factor *= 2;
        }
        if (factor > 1) {
          factor = 1;
        }
        scaleDownFactors[i].push(`&w=${factor}&sharp=40`);
      })
      numberOfImages += rendition.data.rendition_images.length;
    });
    return { scaleDownFactors, numberOfImages }
  };

  const calculateScaleDownFactor = (windowWidth, imgWidthPrismic) => {
    let imgWidthInDom = windowWidth
    if (windowWidth < 900) {
      imgWidthInDom -= 25
    } else {
      imgWidthInDom = 720
    }
    return Math.round(imgWidthInDom / imgWidthPrismic * 100) / 100
  }

  function executeScroll(ref) {
    let tempRef = 0
    if (ref !== 0) {
      if (openAll) {
        for (let i = 0; i < ref; i++) {
          tempRef += openRenditionsRefs[i]
        }
      } else {
        for (let i = 0; i < ref; i++) {
          tempRef += closedRenditionsRefs[i]
        }
      }
    }
    setTimeout(
      () => window.scrollTo(0, ref === 0 || ref === -1 ? tempRef : tempRef + 128),
      100
    );
  }

  function openRendition(value) {
    let openRendition = value + expandValue
    if (value !== 999 && value !== -2) executeScroll(openRendition);
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

  function handleLoad(i) {
    allLoaded.push(true);
    if (allLoaded.length === work.numberOfImages) {
      setTimeout(function () {
        setLoaded(true);
      }, 100);
    }
  }

  function handleScroll() {
    if (window.pageYOffset > 75) setMakeYearSmall(true)
    else setMakeYearSmall(false)
  }

  if (isError) {
    return <NotFound />;
  }

  if (isLoading) {
    return (<Loading>Loading...</Loading>)
  }

  const repoNameArray = /([^/]+)\.cdn.prismic\.io\/api/.exec(apiEndpoint);
  const repoName = repoNameArray[1];

  return (
    <>
    <Helmet>
        <title>Tris Vonna-Michell: Work Renditions</title>
        <meta name="description" content="Presentation of work by Tris Vonna-Michell." />
        <meta property="og:image" content="https://images.prismic.io/trisvonnamichell/6392235a-5597-4bb1-aa05-21a37c33b122_TVM-audio+poems-09+copy+2.jpg" />
        <meta property="og:description" content="Presentation of work by Tris Vonna-Michell." />
        <meta property="og:title" content="Tris Vonna-Michell" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tris Vonna-Michell" />
        <meta name="twitter:description" content="Presentation of work by Tris Vonna-Michell." />
        <meta name="twitter:image" content="https://images.prismic.io/trisvonnamichell/6392235a-5597-4bb1-aa05-21a37c33b122_TVM-audio+poems-09+copy+2.jpg" />
        <link rel="shortcut icon" href="/favicon2.png" />
        <script
          async
          defer
          src={`//static.cdn.prismic.io/prismic.js?repo=${repoName}&new=true`}
        />
      </Helmet>
      <Main loaded={loaded}>
        <GlobalStyle img={work.work_image + imgix} mobile={isMobile} />
        <Nav
          makeYearSmall={makeYearSmall}
          renditions={true}
          mobile={isMobile}
          title={work.work_title[0].text}
          years={`${work.work_year_from}–${work.work_year_to}`}
        />
        <Content position={!toggleScript}>
          <Script
            mobile={isMobile}
            open={!toggleScript}
            position={!toggleScript}
            text={
              <RichText
                key="c"
                render={work.work_script}
                linkResolver={linkResolver}
              />
            }
          />
          <ListContainer position={!toggleScript}>
            {work.renditions.map((rendition, j) => {
              return (
                <RenditionList
                  loaded={loaded}
                  mobile={isMobile}
                  openAll={openAll}
                  refClosedList={refClosedList}
                  refOpenList={refOpenList}
                  key={"a" + j}
                  renditionsLength={work.renditions.length}
                  expandValue={expandValue}
                  id={j}
                  title={rendition.data.rendition_title[0].text}
                  year={rendition.data.rendition_year}
                  descriptionPreview={rendition.data.rendition_images.map(
                    (image, i) => (
                      <DescriptionPreview key={"d" + i}>
                        <Circle />
                        <RichText
                          render={image.rendition_image_caption}
                          linkResolver={linkResolver}
                        />
                      </DescriptionPreview>
                    )
                  )}
                  img={rendition.data.rendition_images.map((image, i) => [
                    <Image
                      onLoad={() => handleLoad(i)}
                      src={image.rendition_image.url + work.scaleDownFactors[j][i]}
                      key={"b" + i}
                      alt={image.rendition_image_caption[0].text}
                    />,
                    <DescriptionPreview key={"c" + i}>
                      <RichText
                        render={image.rendition_image_caption}
                        linkResolver={linkResolver}
                      />
                    </DescriptionPreview>,
                  ])}
                />
              );
            })}
          </ListContainer>
        </Content>
        <NewClock mobile={isMobile} />
        {isMobile ? (
          <StopContainer>
            <StopButton aria-label="Go back to homepage" onClick={() => history.push("/")} tabIndex={0}>
              <StopButtonSymbol src={ButtonFive} alt="Stop symbol" />
            </StopButton>
          </StopContainer>
        ) : (
          <RemoteControl
            expandAll={openAll}
            currentValue={expandValue}
            renditionsLength={work.renditions.length}
            adjustValue={(value) => openRendition(value)}
            toggleScriptRemote={() => toggleScriptState(!toggleScript)}
          />
        )}
      </Main>
    </>
  );
};

export default Renditions;