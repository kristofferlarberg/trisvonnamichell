import React, { useEffect, useState } from "react";
import { Link, RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";

const Title = styled.h1`
  margin-left: 1.5rem;
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
  background-color: #eee;
  margin-bottom: 0.7rem;
  height: 10rem;
`
const Preview = styled.img`
  position: relative;
  left: ${props => props.left}%;
  width: ${props => props.width}%;
  height: 10rem;
  object-fit: cover;
`
const WorkLink = styled.a`
  position: relative;
  top: -10.33rem; 
  height: 10rem;
  text-decoration: none;
  color: inherit;
`
const HoverLine = styled.span`
  display: block;
  text-align: center;
  height: 10rem;
  transition-duration: 0.4s;
  &:hover{
    background-color: #D09C0077;
  }
`
const WorkTitle = styled.h4`
  display: inline-block;
  position: relative;
  top: 3rem;
  margin: 0 0 0.2rem 0;
  padding: 0.3rem 0.6rem 0.3rem 0.6rem;
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
      <div className="home">
        <Title >Tris Vonna-Michell</Title>

        {/* This is how to render a Rich Text field into your template as HTML */}
        {/* <RichText render={doc.data.description} linkResolver={linkResolver} /> */}
        {doc.results.map((item, i) => (
          <Line key={"a" + i}>
            <Preview
              key={"e" + i}
              src={item.data.work_preview_image.url}
              className="link_img"
              alt={item.data.work_title[0].text}
              width={item.image_width / doc.max_width * 100}
              left={(item.data.work_year_from - doc.min_year) / doc.max_width * 100}
            // style={{ "width": `${item.image_width / doc.max_width * 100}%` }}
            />
            <WorkLink href={Link.url(item.link, linkResolver)} key={i}>
              <HoverLine key={"d" + i}>
                <WorkTitle key={"b" + i}>{item.data.work_title[0].text}</WorkTitle><br />
                <WorkTitle key={"c" + i}>{item.data.work_year_from}–{item.data.work_year_to}</WorkTitle>
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
