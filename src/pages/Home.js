import React, { useEffect, useState } from "react";
import { client } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";
import { GlobalStyle } from "../styles/global";
import Nav from "../components/Nav";
import Lines from "../components/Lines";

let ua = navigator.userAgent;
export const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);

const Main = styled.main`
  margin: ${(props) => (props.mobile ? "0 5px" : "0 2rem")};
  width: ${(props) =>
    props.mobile ? "calc(100% - 10px)" : "calc(100% - 4rem)"};
  height: auto;
  opacity: ${(props) => (props.loaded ? "1" : "0")};
  transition: opacity 0.5s ease-in;
`;

export const imgix =
  "&w=0.5&sat=-50&exp=0&invert=true&monochrome=c5c&con=-50&monochrome=%23862e9c";

const Home = ({ match }) => {
  const [doc, setDocData] = useState(null);
  const [notFound, toggleNotFound] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const allLoaded = [];
  const [email, setEmail] = useState(false);

  const toggleTitle = () => {
    setEmail(!email);
  };

  const uid = match.params.uid;

  // Get the categories from Prismic and sort by order field or latest work
  useEffect(() => {
    setTimeout(function () {
      if (!loaded) setLoaded(true);
    }, 5000);
    const fetchData = async () => {
      const result = await client.query(
        Prismic.Predicates.at("document.type", "work"),
        { orderings: "[my.work.order, my.work.work_year_to desc]" }
      );
      //Create the link object and add to result
      if (result) {
        result.results.map((item, i) => {
          let width = item.data.work_year_to - item.data.work_year_from + 1;
          let min_year = item.data.work_year_from;
          let max_year = item.data.work_year_to;
          // let width = result.max_year - item.data.work_year_from + 1;
          // let max_width = width;

          if (i > 0) {
            // max_width = width > result.max_width ? width : result.max_width;
            min_year = min_year < result.min_year ? min_year : result.min_year;
            max_year = max_year > result.max_year ? max_year : result.max_year;
          }

          return [
            (result.results[i].link = {
              id: item.id,
              isBroken: false,
              lang: item.lang,
              link_type: "Document",
              slug: item.slugs[0],
              tags: [],
              type: item.type,
            }),
            (result.results[i].image_width = width),
            (result.min_year = min_year),
            (result.max_year = max_year),
          ];
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
  }, [loaded, uid]); // Skip the Effect hook if the UID hasn't changed

  function handleLoad(i) {
    allLoaded[i] = true;

    if (allLoaded.length === doc.results.length) {
      setTimeout(function () {
        setLoaded(true);
      }, 1000);
    }
  }
  if (doc) {
    return (
      <>
        {!loaded && !isMobile && (
          <p style={{ color: "#fff", margin: "32px 0 0 32px" }}>Loading...</p>
        )}
        <Main loaded={isMobile ? true : loaded} mobile={isMobile}>
          <GlobalStyle />
          <Nav
            mobile={isMobile}
            title={!email ? "Tris Vonna-Michell" : "studiotvm@protonmail.com"}
            years={`Works ${doc.min_year}–`}
            onClick={toggleTitle}
          />

          {doc.results.map((item, i) => {
            let timelineWidth = doc.max_year - doc.min_year + 1;
            return (
              <Lines
                renditions={false}
                loaded={loaded}
                work_preview_image={item.data.work_preview_image.url}
                numberOfWorks={doc.results.length}
                link={item.link}
                work_title={item.data.work_title[0].text}
                work_year_from={item.data.work_year_from}
                work_year_to={item.data.work_year_to}
                handleLoad={() => handleLoad(i)}
                width={(item.image_width / timelineWidth) * 100}
                left={
                  ((item.data.work_year_from - doc.min_year) / timelineWidth) *
                  100
                }
                key={i}
              />
            );
          })}
        </Main>
      </>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Home;
