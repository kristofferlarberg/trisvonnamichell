import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
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

let ua = navigator.userAgent;
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);

const Main = styled.main`
  box-sizing: border-box;
  width: ${isMobile ? "100%" : "calc(100% - 4rem)"};
  height: auto;
  margin: ${isMobile ? "0" : "2rem"};
  opacity: ${(props) => (props.loaded ? "1" : "0")};
  transition: opacity 0.5s ease-in;
`;

const Content = styled.div`
  box-sizing: border-box;
  margin-top: ${isMobile ? "6.3rem" : "8rem"};
  width: 100%;
  height: auto;
  display: flex;
  justify-content: ${(props) => (props.position ? "center" : "flex-end")};
  transition: all 0.3s ease-in;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ListContainer = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.position ? "20" : "40")}vw;
  margin-right: ${(props) => (props.position ? "20" : "0")}vw;
  transition: all 0.3s ease-in;
  @media (max-width: 1280px) {
    margin-left: ${(props) => (props.position ? "10" : "40")}vw;
    margin-right: ${(props) => (props.position ? "10" : "0")}vw;
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
  margin: 0.3rem;
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
  const [doc, setDocData] = useState(null);
  const [notFound, toggleNotFound] = useState(false);
  const [expandValue, setExpandValue] = useState(-1);
  const [toggleScript, toggleScriptState] = useState(true);
  const [openAll, setOpenAll] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const allLoaded = [];

  const [numberOfImages, setNumberOfImages] = useState(0);
  let closedRenditionsRefs = [];
  let openRenditionsRefs = [];
  const history = useHistory();

  let scaleDown = window.innerWidth < 600 || isMobile ? "&w=0.25" : "&w=0.5";

  const uid = match.params.uid;

  useEffect(() => {
    const fetchData = async () => {
      //Get list of all the categories from prismic
      const categories = await client.query(
        Prismic.Predicates.at("document.type", "work")
      );

      //Match the url work category with the list of rendition and find correct id
      const category = categories.results.filter(
        (item) => item.slugs[0] === uid
      )[0];

      //Get renditons with the choosen category, with the id
      const result = await client.query(
        Prismic.Predicates.at("my.rendition.work_category", category.id)
      );
      if (result) {
        result.work_script = category.data.work_script;
        result.work_title = category.data.work_title;
        result.work_year_from = category.data.work_year_from;
        result.work_year_to = category.data.work_year_to;
        result.work_image = category.data.work_preview_image.url;
        // We use the State hook to save the document
        let tempNumberOfImages = 0;
        result.results.map((item) => {
          return tempNumberOfImages += item.data.rendition_images.length;
        });
        setNumberOfImages(tempNumberOfImages);
        return setDocData(result);
      } else {
        // Otherwise show an error message
        console.warn(
          "Document not found. Make sure it exists in your Prismic repository"
        );
        toggleNotFound(true);
      }
    };
    fetchData();
  }, [uid]); // Skip the Effect hook if the UID hasn't changed

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
      value = expandValue + 1 === doc.results.length ? -1 : 1;
      executeScroll(0);
    }
    if (value === -2) {
      setOpenAll(false);
      executeScroll(0);
    }
    setExpandValue(value === -2 ? -1 : value + expandValue);
  }
  function refOpenList(ref) {
    if (openRenditionsRefs.length !== doc.results.length) openRenditionsRefs.push(ref);
  }
  function refClosedList(ref) {
    if (closedRenditionsRefs.length !== doc.results.length) closedRenditionsRefs.push(ref);
  }

  function handleLoad(i) {
    allLoaded.push(true);
    if (allLoaded.length === numberOfImages) {
      setTimeout(function () {
        setLoaded(true);
      }, 1000);
    }
  }
  if (doc && numberOfImages) {
    return (
      <>
        {!loaded && <p style={{ color: "#fff", margin: "32px" }}>Loading...</p>}
        <Main loaded={loaded}>
          <GlobalStyle img={doc.work_image + imgix} />
          <NewClock mobile={isMobile} />
          {isMobile ? (
            <StopContainer>
              <StopButton onClick={() => history.push("/")}>
                <StopButtonSymbol src={ButtonFive} alt="Back to Homepage" />
              </StopButton>
            </StopContainer>
          ) : (
              <RemoteControl
                expandAll={openAll}
                currentValue={expandValue}
                renditionsLength={doc.results.length}
                adjustValue={(value) => openRendition(value)}
                toggleScriptRemote={() => toggleScriptState(!toggleScript)}
              />
            )}
          <Nav
            renditions={true}
            mobile={isMobile}
            title={doc.work_title[0].text}
            years={`${doc.work_year_from}–${doc.work_year_to}`}
          />
          <Content position={!toggleScript}>
            <Script
              mobile={isMobile}
              position={!toggleScript}
              text={
                <RichText
                  key="c"
                  render={doc.work_script}
                  linkResolver={linkResolver}
                />
              }
            />
            <ListContainer position={!toggleScript}>
              {doc.results.map((item, i) => {
                return (
                  <RenditionList
                    loaded={loaded}
                    mobile={isMobile}
                    openAll={openAll}
                    refClosedList={refClosedList}
                    refOpenList={refOpenList}
                    key={"a" + i}
                    renditionsLength={doc.results.length}
                    expandValue={expandValue}
                    id={i}
                    title={item.data.rendition_title[0].text}
                    year={item.data.rendition_year}
                    descriptionPreview={item.data.rendition_images.map(
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
                    img={item.data.rendition_images.map((image, i) => [
                      <Image
                        onLoad={() => handleLoad(i)}
                        src={image.rendition_image.url + scaleDown}
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
        </Main>
      </>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Renditions;
