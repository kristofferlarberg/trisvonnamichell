import React, { useEffect, useState } from "react";
import { Link } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";

const lineHeight = 15;

const Nav = styled.nav`
  padding: 1rem 1.5rem 1rem 1.5rem;
  margin: 0;
  display: flex;
  justify-content: space-between;
  @media (max-width: 500px) {
    margin-left: 0rem;
    font-size: 2rem;
    text-align: center;
  }
  @media (max-width: 400px) {
    margin-left: 0rem;
    font-size: 1.6rem;
    text-align: center;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: white;
`;

const Line = styled.section`
  background-color: #e0e0e0;
  margin-bottom: 5px;
  height: ${lineHeight}rem;
  
`;
const Preview = styled.img`
  position: relative;
  left: ${(props) => props.left}%;
  width: ${(props) => props.width}%;
  height: ${lineHeight}rem;
  object-fit: cover;
`;
const WorkLink = styled.a`
  position: relative;
  top: calc(-15rem - 6px);
  height: ${lineHeight}rem;
  text-decoration: none;
  color: inherit;
`;
const HoverLine = styled.span`
  display: block;
  text-align: center;
  height: ${lineHeight}rem;
  transition-duration: 0.4s;
  &:hover {
    background-color: #fff7;
  }
`;
const WorkTitle = styled.h2`
  display: inline-block;
  position: relative;
  top: ${(lineHeight - 1.4 * 2 - 0.25 - 0.5 * 4) / 2}rem;
  margin: 0 0 0.25rem 0;
  padding: 0.5rem 0.8rem 0.5rem 0.8rem;
  background-color: #fff;
`;

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
          let width = item.data.work_year_to - item.data.work_year_from + 1;
          let min_year = item.data.work_year_from;
          let max_year = item.data.work_year_to;
          console.log(max_year)
          console.log(result.max_year)
          // let width = result.max_year - item.data.work_year_from + 1;
          // let max_width = width;

          if (i > 0) {
            // max_width = width > result.max_width ? width : result.max_width;
            min_year = min_year < result.min_year ? min_year : result.min_year;
            max_year = max_year > result.max_year ? max_year : result.max_year;
          }
          console.log(max_year)

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

  if (doc) {
    console.log(doc)
    return (
      <div>
        <Nav>
          <Title>Tris Vonna-Michell</Title>
          <Title>Works 2003–2015</Title>
        </Nav>

        {/* This is how to render a Rich Text field into your template as HTML */}
        {/* <RichText render={doc.data.description} linkResolver={linkResolver} /> */}
        {doc.results.map((item, i) => {
          let timelineWidth = (doc.max_year - doc.min_year + 1)
          console.log(i + ": " + item.data.work_preview_image.url)
          return (<Line key={"a" + i}>
            <Preview
              key={"e" + i}
              src={item.data.work_preview_image.url}
              className="link_img"
              alt={item.data.work_title[0].text}
              width={(item.image_width / timelineWidth) * 100}
              left={
                ((item.data.work_year_from - doc.min_year) / timelineWidth) *
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
                <br />
                <WorkTitle key={"c" + i}>
                  {item.data.work_year_from}–{item.data.work_year_to}
                </WorkTitle>
              </HoverLine>
            </WorkLink>
          </Line>
          )
        })}
      </div>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Home;
