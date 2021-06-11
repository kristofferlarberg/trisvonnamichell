import React, { useState } from "react";
import { client } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";
import { GlobalStyle } from "../styles/global";
import Nav from "../components/Nav";
import Lines from "../components/Timeline";
import { useQuery } from 'react-query'

let ua = navigator.userAgent;
export const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);

const Main = styled.main`
  margin: ${(props) => (props.mobile ? "0 5px 40px 5px" : "0 2rem 4rem 2rem")};
  width: ${(props) =>
    props.mobile ? "calc(100% - 10px)" : "calc(100% - 4rem)"};
  height: auto;
  opacity: ${(props) => (props.loaded ? "1" : "0")};
  transition: opacity 0.5s ease-in;
`;
const Loading = styled.p`
  color: #fff;
  margin: 32px 0 0 32px;
  font-family: "PT-Regular", sans-serif;
  font-size: 1.05rem;
`;

export const imgix =
  "&sat=-50&exp=0&invert=true&monochrome=c5c&con=-50&monochrome=%23862e9c";

const Home = ({ match }) => {
  const [loaded, setLoaded] = useState(false);
  const allLoaded = [];
  const [email, setEmail] = useState(false);

  const toggleTitle = () => {
    setEmail(!email);
  };
  const getWorks = async () => {
    return await client.query(
      Prismic.Predicates.at("document.type", "work"),
      { orderings: "[my.work.order, my.work.work_year_to desc]" }
    );
  };

  async function createTimelines() {
    const works = await getWorks();
    const worksWithLinkObject = { ...createTimelineLinks(works) }
    const { min_year, max_year } = getMaxAndMinYears(worksWithLinkObject)
    return { ...worksWithLinkObject, min_year, max_year }
  }

  const { data: timelines, isError, isLoading, isSuccess } = useQuery('timelines', createTimelines)

  const getMaxAndMinYears = (works) => {
    let max_year = works.results[0].data.work_year_to
    let min_year = works.results[0].data.work_year_from
    works.results.forEach(work => {
      min_year = work.data.work_year_from < min_year ? work.data.work_year_from : min_year
      max_year = work.data.work_year_to > max_year ? work.data.work_year_to : max_year
    })
    return { min_year, max_year }
  }

  const createTimelineLinks = (works) => {
    works.results.forEach((work, i) => {
      const width = work.data.work_year_to - work.data.work_year_from + 1;
      const newItem = {
        ...work,
        link: {
          id: work.id,
          isBroken: false,
          lang: work.lang,
          link_type: "Document",
          uid: work.uid,
          tags: [],
          type: work.type,
        },
        image_width: width,
      };
      works.results[i] = newItem
    });
    return works;
  };

  const handleLoad = (i) => {
    if (allLoaded.length === 0) {
      timelines.results.forEach(work => {
        if (work.data.work_script.length) {
          allLoaded.push(false)
        }
      })
    }
    allLoaded[i] = true;
    if (allLoaded.every(value => value)) {
      setLoaded(true);
    }
  }

  if (isMobile && isSuccess) {
    setTimeout(() => { setLoaded(true) }, 250);
  }

  if (isError) {
    return <NotFound />;
  }

  if (isLoading) {
    return (<Loading>Loading...</Loading>)
  }

  return (
    <>
      <Main loaded={loaded} mobile={isMobile}>
        <GlobalStyle />
        <Nav
          mobile={isMobile}
          title={!email ? "Tris Vonna-Michell" : "studiotvm@protonmail.com"}
          years={`Works ${timelines.min_year}–`}
          toggleTitle={toggleTitle}
        />

        {timelines.results.map((item, i) => {
          let timelineWidth = timelines.max_year - timelines.min_year + 1;
          return (
            item.data.work_script.length > 0 && <Lines
              renditions={false}
              loaded={loaded}
              work_preview_image={item.data.work_preview_image.url}
              work_preview_image_width={item.data.work_preview_image.dimensions.width}
              work_preview_image_height={item.data.work_preview_image.dimensions.height}
              numberOfWorks={timelines.results.length}
              link={item.link}
              work_title={item.data.work_title[0].text}
              work_year_from={item.data.work_year_from}
              work_year_to={item.data.work_year_to}
              handleLoad={() => handleLoad(i)}
              width={(item.image_width / timelineWidth) * 100}
              left={
                ((item.data.work_year_from - timelines.min_year) / timelineWidth) *
                100
              }
              key={i}
            />
          );
        })}
      </Main>
    </>
  );
}

export default Home;