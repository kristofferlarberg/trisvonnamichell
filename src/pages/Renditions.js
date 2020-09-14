import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";

const Renditions = ({ match }) => {
  const [doc, setDocData] = useState(null);
  const [notFound, toggleNotFound] = useState(false);

  console.log(match);

  const uid = match.params.uid;

  // console.log('match:')
  // console.log(tag)

  // Get the page document from Prismic
  useEffect(() => {
    const fetchData = async () => {
      // We are using the function to get a document by its UID
      // const result = await client.getByUID('blog', uid)

      //Get list of all the categories from prismic
      const categories = await client.query(
        Prismic.Predicates.at("document.type", "work")
      );
      
      console.log(uid);

      //Match the url work category with the list of categories and find correct id
      const category_id = categories.results.filter(item => item.slugs[0] === uid)[0].id;

      console.log(category_id);

      //Get posts with the choosen category, with the id
      const result = await client.query(
        Prismic.Predicates.at("my.rendition.work_category", category_id)
      );

      console.log(result);

      if (result) {
        // We use the State hook to save the document
        console.log(result);
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
        <h1 key={"a" + i}>{RichText.asText(item.data.title)}</h1>
        {/* This is how to render a Rich Text field into your template as HTML */}
        <RichText
          key={"b" + i}
          render={item.data.caption}
          linkResolver={linkResolver}
        />
        {/* This is how to get an image into your template */}
        <img
          src={item.data.image.url}
          key={"c" + i}
          alt={item.data.image.alt}
        />
      </div>
    ));
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Renditions;
