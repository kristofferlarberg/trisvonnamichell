import React, { useEffect, useState } from "react";
import { Link, RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";

const Home = ({ match }) => {
  const [doc, setDocData] = useState(null);
  const [notFound, toggleNotFound] = useState(false);

  const uid = match.params.uid;

  // Get the categories from Prismic
  useEffect(() => {
    const fetchData = async () => {
      const result = await client.query(
        Prismic.Predicates.at("document.type", "work")
      );

      //Create the link object and add to result
      if (result) {
        result.results.map((item, i) => {
          result.results[i].link = {
            id: item.id,
            isBroken: false,
            lang: item.lang,
            link_type: "Document",
            slug: item.slugs[0],
            tags: [],
            type: item.type,
          };
        });

        // We use the State hook to save the document
        return setDocData(result);
      } else {
        // Otherwise show an error message
        console.warn(
          "Page document not found. Make sure it exists in your Prismic repository"
        );
        toggleNotFound(true);
      }
    };
    fetchData();
  }, [uid]); // Skip the Effect hook if the UID hasn't changed

  if (doc) {
    console.log(doc);
    return (
      <div className="home">
        <h1>Tris Vonna-Michell</h1>
        <br />

        {/* This is how to render a Rich Text field into your template as HTML */}
        {/* <RichText render={doc.data.description} linkResolver={linkResolver} /> */}
        {doc.results.map((item, i) => (
          <a href={Link.url(item.link, linkResolver)} key={i}>
            {item.data.work_title[0].text}
            <br />
            <img
              key={"a" + i}
              src={item.data.work_preview_image.url}
              className="link_img"
            />{" "}
            <br />{" "}
          </a>
        ))}
      </div>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Home;
