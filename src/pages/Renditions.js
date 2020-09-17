import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";

import RenditionList from "../components/RenditionList";

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
    return [
      <div key="a">
        <RichText key="b" render={doc.work_title} linkResolver={linkResolver} />
        <RichText
          key="c"
          render={doc.work_script}
          linkResolver={linkResolver}
        />
      </div>,
      doc.results.map((item) => (
        <RenditionList
          title={RichText.asText(item.data.rendition_title)}
          descriptionOnly={item.data.rendition_images.map((image, i) => (
            <RichText
              key={"c" + i}
              render={image.rendition_image_caption}
              linkResolver={linkResolver}
            />
          ))}
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
      )),
    ];
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
