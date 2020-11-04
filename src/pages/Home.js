import React, { useEffect, useState } from "react";
import { Link } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";
import { GlobalStyle } from "../styles/global";
import Nav from "../components/Nav";

const lineHeight = 17;

const Main = styled.main`
  margin: 2rem;
  width: calc(100% - 4rem);
  height: auto;
  opacity: ${props => props.loaded ? "1" : "0"};
  transition: opacity 0.5s ease-in;
`;

const LineContainer = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
  opacity: 
`;

const Line = styled.section`
  background-color: #454;
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 5px;
  height: ${lineHeight}rem;
  width: 90%;
  box-sizing: border-box;
`;

const Preview = styled.img`
  position: relative;
  display: block;
  left: ${(props) => props.width > 0 ? props.left : 0}%;
  width: ${(props) => props.width > 0 ? props.width : "100"}%;
  height: 100%;
  object-fit: cover;
`;

const WorkLink = styled.a`
  position: relative;
  top: calc(-17rem);
  height: ${lineHeight}rem;
  text-decoration: none;
  color: inherit;
`;

const HoverLine = styled.section`
  display: flex;
  top: 0;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  text-align: center;
  height: ${lineHeight}rem;
  transition-duration: 0.4s;
  &:hover {
    background-color: #ccc8;
  }
`;

const WorkTitle = styled.h2`
  display: block;
  // top: ${(lineHeight - 1.4 * 2 - 0.25 - 0.5 * 4) / 2}rem;
  max-width:80%;
  width: auto;
  margin: 0 0 0.25rem 0;
  padding: 0.5rem 0.8rem 0.5rem 0.8rem;
  background-color: var(--offwhite);
  &:last-child {
    margin: 0;
  }
`;


const Ends = styled.section`
  background-color: #000;
  height: ${lineHeight}rem;
  width: 5%;
  min-width: 30px;
  color: var(--lightgrey);
  text-align: center;
  line-height: 0.9rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 15%;
  background-color: var(--lightgrey);
`;

export const imgix =
  "&w=0.75&sat=-50&exp=0&invert=true&monochrome=c5c&con=-50&monochrome=%23862e9c";

const Home = ({ match }) => {
  const [doc, setDocData] = useState(null);
  const [notFound, toggleNotFound] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const allLoaded = []

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
            // (result.max_width = max_width),
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
  }, [uid]); // Skip the Effect hook if the UID hasn't changed

  function handleLoad(i) {
    allLoaded[i] = true
    if (allLoaded.length === doc.results.length) {
      setTimeout(
        function () {
          setLoaded(true)
        }, 1000)
    }
  }
  if (doc) {
    return (
      <>
        {!loaded && <p style={{ "color": "#fff", "margin": "32px 0 0 32px" }}>Loading...</p>}
        <Main loaded={loaded}>
          <GlobalStyle />
          <Nav title="Tris Vonna-Michell" years="Works 2003–2015" />
          {/* This is how to render a Rich Text field into your template as HTML */}
          {/* <RichText render={doc.data.description} linkResolver={linkResolver} /> */}
          {doc.results.map((item, i) => {
            let timelineWidth = doc.max_year - doc.min_year + 1;
            return (
              <LineContainer key={i} show={loaded}>
                <Ends>
                  <VerticalLine />
                </Ends>
                <Line
                  img={item.data.work_preview_image.url + imgix}
                  key={"a" + i}
                >
                  <Preview
                    key={"e" + i}
                    onLoad={() => handleLoad(i)}
                    src={item.data.work_preview_image.url}
                    className="link_img"
                    alt={item.data.work_title[0].text}
                    width={(item.image_width / timelineWidth) * 100}
                    left={
                      ((item.data.work_year_from - doc.min_year) /
                        timelineWidth) *
                      100
                    }
                  // style={{ "width": `${item.image_width / doc.max_width * 100}%` }}
                  />
                  <WorkLink
                    numberOfWorks={doc.results.length}
                    href={Link.url(item.link, linkResolver)}
                    key={i}
                  >
                    <HoverLine key={"d" + i}>
                      <WorkTitle key={"b" + i}>
                        {item.data.work_title[0].text}
                      </WorkTitle>
                      <WorkTitle key={"c" + i}>
                        {item.data.work_year_from}–{item.data.work_year_to}
                      </WorkTitle>
                    </HoverLine>
                  </WorkLink>
                </Line>
                <Ends>
                  <VerticalLine />
                </Ends>
              </LineContainer>
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
