import React, { useEffect, useState } from "react";
import { Link } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";

const lineHeight = 15

const Title = styled.nav`
  padding: 1rem 2.5rem 1rem 2.5rem;
  margin: 0;
  background-color: white;
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
`
const Line = styled.section`
  background-color: #e0e0e0;
  border-bottom: 4px solid white;
  height: ${lineHeight}rem;
`
const Preview = styled.img`
  position: relative;
  left: ${props => props.left}%;
  width: ${props => props.width}%;
  height: ${lineHeight}rem;
  object-fit: cover;
`
const WorkLink = styled.a`
  position: relative;
  top: -${props => lineHeight + 1 / props.numberOfWorks}rem; 
  height: ${lineHeight}rem;
  text-decoration: none;
  color: inherit;
`
const HoverLine = styled.span`
  display: block;
  text-align: center;
  height: ${lineHeight}rem;
  transition-duration: 0.4s;
  &:hover{
    background-color: #D09C0077;
  }
`
const WorkTitle = styled.h4`
  display: inline-block;
  position: relative;
  top: ${(lineHeight - 1.4 * 2 - 0.25 - 0.5 * 4) / 2}rem;
  margin: 0 0 0.25rem 0;
  padding: 0.5rem 0.8rem 0.5rem 0.8rem;
  background-color: #fff;
`

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
          let max_width = width;
          let min_year = item.data.work_year_from
          let max_year = item.data.work_year_to
          if (i > 0) {
            max_width = width > result.max_width ? width : result.max_width;
            min_year = min_year < result.min_year ? min_year : result.min_year;
            max_year = max_year < result.max_year ? max_year : result.max_year;
          }
          return [result.results[i].link = {
            id: item.id,
            isBroken: false,
            lang: item.lang,
            link_type: "Document",
            slug: item.slugs[0],
            tags: [],
            type: item.type,
          }, result.results[i].image_width = width,
          result.max_width = max_width,
          result.min_year = min_year,
          result.max_year = max_year,
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
    return (
      <div>
        <Title>
          <h1>Tris Vonna-Michell</h1>
        </Title>

        {/* This is how to render a Rich Text field into your template as HTML */}
        {/* <RichText render={doc.data.description} linkResolver={linkResolver} /> */}
        {doc.results.map((item, i) => (
          <Line key={"a" + i}>
            <Preview
              key={"e" + i}
              src={item.data.work_preview_image.url}
              className="link_img"
              alt={item.data.work_title[0].text}
              width={(item.image_width / doc.max_width) * 100}
              left={
                ((item.data.work_year_from - doc.min_year) / doc.max_width) *
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
        ))}
      </div>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Home;
