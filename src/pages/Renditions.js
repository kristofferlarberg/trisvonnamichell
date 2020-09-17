import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";

import RenditionList from "../components/RenditionList";

const ContentContainer = styled.div`
  display: flex;
  width: 100vw;
`;

const Script = styled.section`
  margin-left: 4rem;
  padding: 1.5rem;
  width: 30vw;
  background-color: yellow;
`;

const ListContainer = styled.div`
margin-left: 4rem;
  display: flex;
  flex-direction: column;
  width: 50vw;
`;

const DescriptionPreview = styled.div`
  display: flex;
  align-items: center;
`;

const Bullet = styled.h2`
  margin-top: 1.8rem;
`;

const Renditions = ({ match }) => {
  const [doc, setDocData] = useState(null);
  const [notFound, toggleNotFound] = useState(false);

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

  if (doc) {
    console.log(doc);
    return (
      <>
        <div key="a">
          <RichText
            key="b"
            render={doc.work_title}
            linkResolver={linkResolver}
          />
        </div>
        <ContentContainer>
          <Script>
            <RichText
              key="c"
              render={doc.work_script}
              linkResolver={linkResolver}
            />
          </Script>
          <ListContainer>
            {doc.results.map((item, i) => (
              <RenditionList
                title={
                  <RichText
                    key={i}
                    render={item.data.rendition_title}
                    linkResolver={linkResolver}
                  />
                }
                descriptionPreview={item.data.rendition_images.map(
                  (image, i) => (
                    <DescriptionPreview>
                      <Bullet>&#8226;</Bullet>
                      <RichText
                        key={"c" + i}
                        render={image.rendition_image_caption}
                        linkResolver={linkResolver}
                      />
                    </DescriptionPreview>
                  )
                )}
                img={item.data.rendition_images.map((image, i) => [
                  <img
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

/*       <div key={i} className="renditions">
        <h3 key={"a" + i}>{RichText.asText(item.data.rendition_title)}</h3>

        {item.data.rendition_images.map((image, i) => ([
          <img
            src={image.rendition_image.url}
            key={"b" + i}
            alt={image.rendition_image_caption[0].text}
          />,
          <RichText
            key={"c" + i}
            render={image.rendition_image_caption}
            linkResolver={linkResolver}
          />]
        ))}

      </div> */
