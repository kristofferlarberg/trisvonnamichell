import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";

import RenditionList from "../components/RenditionList";
import Script from "../components/Script";
import Header from "../components/Header";
import RemoteControl from "../components/RemoteControl";



const ContentContainer = styled.div`
  display: flex;
  width: 100vw;
  margin-top: 10rem;
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
  align-items: center;
`;

const DescriptionPreviewText = styled.h5`
  margin: 0;
`;

const Bullet = styled.h2`
  margin: -0.3rem 1rem 0 0;
`;
const Image = styled.img`
  width: 100%;
`;

const Renditions = ({ match }) => {
  const [doc, setDocData] = useState(null);
  const [notFound, toggleNotFound] = useState(false);
  const [expandValue, setExpandValue] = useState(-1);
  const [toggleScript, toggleScriptState] = useState(true);

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
  // function handleClick() {
  //   toggleScriptState(!toggleScript);
  // }
  if (doc) {

    return (
      <>
        <RemoteControl
          currentValue={expandValue}
          renditionsLength={doc.results.length}
          adjustValue={(value) => setExpandValue(value + expandValue)}
          currentScriptValue={toggleScript}
          toggleScriptRemote={(value) => toggleScriptState(value)} />
        <Header
          text={doc.work_title[0].text}
        //   <RichText
        //     key="b"
        //     render={doc.work_title}
        //     linkResolver={linkResolver}
        //   />
        // }
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
            {doc.results.map((item, i) => (
              <RenditionList
                key={"a" + i}
                renditionsLength={doc.results.length}
                expandValue={expandValue}
                id={i}
                // rendArray={rendArray}
                title={
                  item.data.rendition_title[0].text}
                //   <RichText
                //     key={i}
                //     render={item.data.rendition_title}
                //     linkResolver={linkResolver}
                //   />
                // }
                descriptionPreview={item.data.rendition_images.map(
                  (image, i) => (
                    <DescriptionPreview key={"d" + i}
                    >
                      <Bullet key={"e" + i}
                      >&#8226;</Bullet>
                      <DescriptionPreviewText>
                        {image.rendition_image_caption[0].text}
                        {/* <RichText
                          key={"c" + i}
                          render={image.rendition_image_caption}
                          linkResolver={linkResolver}
                        /> */}
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
                  <RichText
                    key={"c" + i}
                    render={image.rendition_image_caption}
                    linkResolver={linkResolver}
                  />,
                ])}
              />
            ))}
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
