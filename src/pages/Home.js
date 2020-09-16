import React, { useEffect, useState } from "react";
import { Link, RichText } from "prismic-reactjs";
import { client, linkResolver } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";

const Title = styled.h2`
  margin-left:1.5rem;
`
const Line = styled.section`
  background-color: #eee;
  margin-bottom: 0.7rem;
  height: 10rem;
  text-align: right;
`
const Preview = styled.img`
  height: 10rem;
  object-fit: cover;
  opacity: 0.8;
`
const WorkLink = styled.a`
  height: 10rem;
  position: relative;
  top:-10.33rem; 
  text-decoration: none;
`
const HoverLine = styled.span`
  display:block;
  text-align: center;
  height: 10rem;
  &:hover{
    background-color: #D09C0077;
  }
`
const WorkTitle = styled.h3`
    color: black;
    position: relative;
    display: inline-block;
    top: 3rem;
    margin:0rem;
    margin-bottom:0.2rem;
    padding:0.3rem;
    font-size: 1rem;
    z-index: 1;
    background-color: white;
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
          if (i > 0) {
            max_width = width > result.max_width ? width : result.max_width;
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
          result.max_width = max_width
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
              style={{ "width": `${item.image_width / doc.max_width * 100}%` }}
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
