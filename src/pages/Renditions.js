import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";

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
      const category_id = categories.results.filter(item => item.slugs[0] === uid)[0].id;

      //Get renditons with the choosen category, with the id
      const result = await client.query(
        Prismic.Predicates.at("my.rendition.work_category", category_id)
      );

      if (result) {

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

    return doc.results.map((item, i) => (
      <div key={i} className="renditions">
        {/* This is how to render a Rich Text field as plain text*/}
        <h1 key={"a" + i}>{RichText.asText(item.data.rendition_title)}</h1>

        {item.data.rendition_images.map((image, i) => ([
          <img
            src={image.rendition_image.url}
            key={"c" + i}
            alt={image.rendition_image_caption[0].text}
          />,
          <RichText
            key={"b" + i}
            render={image.rendition_image_caption}
            linkResolver={linkResolver}
          />]
        ))}

      </div>
    ));
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Renditions;
