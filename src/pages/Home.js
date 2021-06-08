import React, { useState } from "react";
import { client } from "../prismic-configuration";
import NotFound from "./NotFound";
import Prismic from "prismic-javascript";
import styled from "styled-components";
import { GlobalStyle } from "../styles/global";
import Nav from "../components/Nav";
import Lines from "../components/Lines";
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
  "&w=0.5&sat=-50&exp=0&invert=true&monochrome=c5c&con=-50&monochrome=%23862e9c";

const Home = ({ match }) => {
  const [timelines, setTimelines] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const allLoaded = [];
  const [email, setEmail] = useState(false);
  //const uid = match.params.uid;

  // Access the client
  //const queryClient = useQueryClient()

  // Mutations
  // const mutation = useMutation(postTodo, {
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries('allLines')
  //   },
  // })

  const getWorks = async () => {
    const result = await client.query(
      Prismic.Predicates.at("document.type", "work"),
      { orderings: "[my.work.order, my.work.work_year_to desc]" }
    );
    return result
  };

  // Queries
  const { data, isError, isLoading, isSuccess } = useQuery('allWorks', getWorks)

  const toggleTitle = () => {
    setEmail(!email);
  };

  // Get the categories from Prismic and sort by order field or latest work
  const createTimelineLinks = (result) => {
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
      //Create the link object and add to result

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
    return setTimelines(result);
  };

  const handleLoad = (i) => {
    if (allLoaded.length === 0) {
      data.results.forEach(result => {
        if (result.data.work_script.length) {
          allLoaded.push(false)
        }
      })
    }
    allLoaded[i] = true;
    if (allLoaded.every(value => value)) {
      setLoaded(true);
    }
  }

  if (!isLoading && !timelines && isSuccess) {
    createTimelineLinks(data)
  }

  if (isError) {
    return <NotFound />;
  }

  if (isMobile && timelines) {
    setTimeout(() => { setLoaded(true) }, 250);
  }

  if (!timelines) {
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
          onClick={toggleTitle}
        />

        {timelines.results.map((item, i) => {
          let timelineWidth = timelines.max_year - timelines.min_year + 1;
          return (
            item.data.work_script.length > 0 && <Lines
              renditions={false}
              loaded={loaded}
              work_preview_image={item.data.work_preview_image.url}
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
