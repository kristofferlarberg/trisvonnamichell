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

let ua = navigator.userAgent;
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);

const Main = styled.main`
  box-sizing: border-box;
  width: ${isMobile ? "100%" : "calc(100% - 4rem)"};
  height: auto;
  margin: ${isMobile ? "0" : "2rem"};
`;

const Content = styled.div`
  box-sizing: border-box;
  margin-top: ${isMobile ? "7rem" : "8rem"};
  width: 100%;
  height: auto;
  display:flex;
  justify-content: ${(props) => (props.position ? "center" : "flex-end")};
  transition: all 0.3s ease-in;
  @media (max-width: 900px){
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
  @media (max-width: 1280px){
    margin-left: ${(props) => (props.position ? "10" : "40")}vw;
    margin-right: ${(props) => (props.position ? "10" : "0")}vw; 
  }
  @media (max-width: 900px){
    margin: 0; 
  }
`;

const DescriptionPreview = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const DescriptionPreviewText = styled.h4`
  margin: 0;
  margin-bottom: ${(props) => props.open && "1rem"};
  width: 100%;
`;

const Bullet = styled.h2`
  margin: -1.4rem 1rem 0 0;
`;

const Image = styled.img`
  width: 100%;
`;

const Square = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 2rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #000;
  z-index: 2;
`

const Renditions = ({ match }) => {
  const [doc, setDocData] = useState(null);
  const [notFound, toggleNotFound] = useState(false);
  const [expandValue, setExpandValue] = useState(-1);
  const [toggleScript, toggleScriptState] = useState(true);
  const [openAll, setOpenAll] = useState(false);
  let renditionsRefs = [];
  const history = useHistory();

  /*   const imgix = "&sat=-50&exp=0&invert=true&monochrome=c5c&con=5&monochrome=%23862e9c"; */

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
    if (ref) {
      let margin = ref.current.offsetTop === 200 ? 250 : 200;
      setTimeout(
        () => window.scrollTo(0, ref.current.offsetTop - margin),
        openAll ? 100 : 300
      );
    }
  }

  function openRendition(value) {
    if (value === 999) {
      setOpenAll(true);
      // value = expandValue > 0 ? -1 : 1
      value = expandValue + 1 === doc.results.length ? -1 : 1;
    }
    if (value === -2) setOpenAll(false);
    setExpandValue(value === -2 ? -1 : value + expandValue);
    executeScroll(renditionsRefs[0]);
  }
  function refList(ref) {
    renditionsRefs.push(ref);
  }

  if (doc) {
    return (
      <Main>
        <GlobalStyle img={doc.work_image + imgix} />
        <NewClock mobile={isMobile} />
        {isMobile ?
          <Square onClick={() => history.push("/")} />
          : <RemoteControl
            expandAll={openAll}
            currentValue={expandValue}
            renditionsLength={doc.results.length}
            adjustValue={(value) => openRendition(value)}
            toggleScriptRemote={() => toggleScriptState(!toggleScript)}
          />}
        <Nav
          renditions={true}
          mobile={isMobile}
          title={doc.work_title[0].text}
          years={`${doc.work_year_from}–${doc.work_year_to}`}
        />
        <Content position={!toggleScript}
        >
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
                  mobile={isMobile}
                  openAll={openAll}
                  refList={refList}
                  key={"a" + i}
                  renditionsLength={doc.results.length}
                  expandValue={expandValue}
                  id={i}
                  title={item.data.rendition_title[0].text}
                  year={item.data.rendition_year}
                  //   <RichText
                  //     key={i}
                  //     render={item.data.rendition_title}
                  //     linkResolver={linkResolver}
                  //   />
                  // }
                  descriptionPreview={item.data.rendition_images.map(
                    (image, i) => (
                      <DescriptionPreview key={"d" + i}>
                        <Circle />
                        <DescriptionPreviewText>
                          {image.rendition_image_caption[0].text}
                        </DescriptionPreviewText>
                      </DescriptionPreview>
                    )
                  )}
                  img={item.data.rendition_images.map((image, i) => [
                    <Image
                      src={image.rendition_image.url}
                      key={"b" + i}
                      alt={image.rendition_image_caption[0].text}
                    />,
                    <DescriptionPreviewText key={"c" + i} open={true}>
                      {image.rendition_image_caption[0].text}
                    </DescriptionPreviewText>,
                  ])}
                />
              );
            })}
          </ListContainer>
        </Content>
      </Main>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Renditions;