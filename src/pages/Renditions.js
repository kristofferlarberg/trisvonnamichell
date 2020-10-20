import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";
import { GlobalStyle } from "../styles/global";
import RenditionList from "../components/RenditionList";
import Script from "../components/Script";
import Header from "../components/Header";
import RemoteControl from "../components/RemoteControl";
import NewClock from "../components/NewClock";
import { imgix } from "./Home";
import { BlackCircle } from "../components/Circle";

const ContentContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  padding-top: 5rem;
`;

const ListContainer = styled.div`
  margin-left: ${(props) => (props.position ? "20" : "40")}vw;
  margin-right: ${(props) => (props.position ? "20" : "4")}vw;
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: all 0.2s ease-in;
`;

const DescriptionPreview = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const DescriptionPreviewText = styled.h5`
  margin: 0;
  margin-bottom: ${(props) => props.open && "1rem"};
`;

const Bullet = styled.h2`
  margin: -1.4rem 1rem 0 0;
`;
const Image = styled.img`
  width: 100%;
`;

const Renditions = ({ match }) => {
  const [doc, setDocData] = useState(null);
  const [notFound, toggleNotFound] = useState(false);
  const [expandValue, setExpandValue] = useState(-1);
  const [toggleScript, toggleScriptState] = useState(true);
  const [toggleRemote, toggleRemoteState] = useState(true);
  const [openAll, setOpenAll] = useState(false);
  let renditionsRefs = [];
  /*   const imgix = "&sat=-50&exp=0&invert=true&monochrome=c5c&con=5&monochrome=%23862e9c"; */
  // const [rendArray, setRendArray] = useState(null);

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
        // setRendArray(result.results);
        return setDocData(result);
      } else {
        // Otherwise show an error message
        console.warn(
          "Blog document not found. Make sure it exists in your Prismic repository"
        );
        toggleNotFound(true);
      }
    };
    fetchData();
  }, [uid]); // Skip the Effect hook if the UID hasn't changed

  function handleClick() {
    toggleRemoteState(!toggleRemote);
  }

  function executeScroll(ref) {
    if (ref) {
      let margin = ref.current.offsetTop === 152 ? 202 : 152;
      setTimeout(
        () => window.scrollTo(0, ref.current.offsetTop - margin),
        openAll ? 100 : 300
      );
    }
  }

  function openRendition(value) {
    console.log(value);
    if (value === 999) {
      setOpenAll(true);
      // value = expandValue > 0 ? -1 : 1
      value = expandValue + 1 === doc.results.length ? -1 : 1;
    }
    if (value === -2) setOpenAll(false);
    setExpandValue(value === -2 ? -1 : value + expandValue);
    executeScroll(renditionsRefs[value + expandValue]);
  }
  function refList(ref) {
    renditionsRefs.push(ref);
  }

  if (doc) {
    return (
      <>
        <GlobalStyle img={doc.work_image + imgix} />
        <NewClock />
        <RemoteControl
          expandAll={openAll}
          handleClick={handleClick}
          position={toggleRemote}
          currentValue={expandValue}
          renditionsLength={doc.results.length}
          adjustValue={(value) => openRendition(value)}
          currentScriptValue={toggleScript}
          toggleScriptRemote={(value) => toggleScriptState(value)}
        />
        <Header
          text={`${doc.work_title[0].text}`}
          year={`${doc.work_year_from}–${doc.work_year_to}`}
        />
        <ContentContainer>
          <Script
            // handleClick={handleClick}
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
                  openAll={openAll}
                  refList={refList}
                  key={"a" + i}
                  renditionsLength={doc.results.length}
                  expandValue={expandValue}
                  id={i}
                  // rendArray={rendArray}
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
                        <BlackCircle />
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
        </ContentContainer>
      </>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Renditions;
