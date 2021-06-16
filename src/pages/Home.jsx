import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import Prismic from 'prismic-javascript';
import styled from 'styled-components';
import {useQuery} from 'react-query';

import {apiEndpoint, client} from '../prismic-configuration';
import GlobalStyle from '../styles/global';
import HomeHeader from '../components/HomeHeader';
// import Nav from '../components/Nav';
import NotFound from './NotFound';
import WorkTimeline from '../components/WorkTimeline';

// const ua = navigator.userAgent;
export const isMobile = window.innerWidth < 900;

const Main = styled.main`
  margin: ${props => (props.mobile ? '200px 5px 40px 5px' : '10rem 2rem 2rem 2rem')};
  width: ${props => (props.mobile ? 'calc(100% - 10px)' : 'calc(100% - 4rem)')};
  height: auto;
  opacity: ${props => (props.loaded ? '1' : '0')};
  transition: opacity 0.5s ease-in;
`;
const Loading = styled.p`
  color: var(--offwhite);
  margin: 32px 0 0 32px;
  font-family: "PT-Regular", sans-serif;
  font-size: 1.05rem;
`;
const Footer = styled.p`
  color: var(--offwhite);
  margin-top: 2rem;
`;

export const imgix = '&sat=-50&exp=0&invert=true&monochrome=c5c&con=-50&monochrome=%23862e9c';

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const allLoaded = [];
  const emailAddress = 'studiotvm@protonmail.com';
  let prologue = 'Text about Tris lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore esse qui animi nobis laboriosam est s? ';
  prologue += 'Possimus veniam, ratione esse qui animi nobis laboriosam ea voluptate unde corporis ipsum et magni! ';
  // const [email, setEmail] = useState(false);

  // const toggleTitle = () => {
  //   setEmail(!email);
  // };

  const getWorks = async () => {
    try {
      const works = await client.query(
        Prismic.Predicates.at('document.type', 'work'),
        {orderings: '[my.work.order, my.work.work_year_to desc]'},
      );
      return works;
    }
    catch {
      throw new Error('No data found');
    }
  };

  const getMaxAndMinYears = (works) => {
    let maxYear = works.results[0].data.work_year_to;
    let minYear = works.results[0].data.work_year_from;
    works.results.forEach((work) => {
      minYear = work.data.work_year_from < minYear ? work.data.work_year_from : minYear;
      maxYear = work.data.work_year_to > maxYear ? work.data.work_year_to : maxYear;
    });
    return {maxYear, minYear};
  };

  async function createWorkTimelines() {
    const works = await getWorks();
    const worksWithAddedProperties = works;

    works.results.forEach((work, i) => {
      const width = work.data.work_year_to - work.data.work_year_from + 1;
      const workLink = {
        ...work,
        image_width: width,
        link: {
          id: work.id,
          isBroken: false,
          lang: work.lang,
          link_type: 'Document',
          tags: [],
          type: work.type,
          uid: work.uid,
        },
      };
      worksWithAddedProperties.results[i] = workLink;
    });

    const {minYear, maxYear} = getMaxAndMinYears(worksWithAddedProperties);
    return {...worksWithAddedProperties, maxYear, minYear};
  }

  const {
    data: workTimelines, isError, isLoading, isSuccess,
  } = useQuery('workTimelines', createWorkTimelines);

  const handleLoad = (i) => {
    if (allLoaded.length === 0) {
      workTimelines.results.forEach((work) => {
        if (work.data.work_script.length > 0) {
          allLoaded.push(false);
        }
      });
    }
    allLoaded[i] = true;
    if (allLoaded.every(value => value)) {
      setLoaded(true);
    }
  };

  if (isMobile && isSuccess) {
    setTimeout(() => {
      setLoaded(true);
    }, 250);
  }

  if (isError) {
    return <NotFound />;
  }

  if (isLoading) {
    return (<Loading>Loading...</Loading>);
  }

  const repoNameArray = /([^/]+)\.cdn.prismic\.io\/api/.exec(apiEndpoint);
  const repoName = repoNameArray[1];

  return (
    <>
      <Helmet>
        <title>Tris Vonna-Michell</title>
        <meta content="Presentation of work by Tris Vonna-Michell." name="description" />
        <meta
          content="https://images.prismic.io/trisvonnamichell/6392235a-5597-4bb1-aa05-21a37c33b122_TVM-audio+poems-09+copy+2.jpg"
          property="og:image"
        />
        <meta content="Presentation of work by Tris Vonna-Michell." property="og:description" />
        <meta content="Tris Vonna-Michell" property="og:title" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="Tris Vonna-Michell" name="twitter:title" />
        <meta content="Presentation of work by Tris Vonna-Michell." name="twitter:description" />
        <meta
          content="https://images.prismic.io/trisvonnamichell/6392235a-5597-4bb1-aa05-21a37c33b122_TVM-audio+poems-09+copy+2.jpg"
          name="twitter:image"
        />
        <link href="/favicon1.png" rel="shortcut icon" />
        <script
          async
          defer
          src={`//static.cdn.prismic.io/prismic.js?repo=${repoName}&new=true`}
        />
      </Helmet>
      <Main loaded={loaded} mobile={isMobile}>
        <GlobalStyle />
        {/* <Nav
          mobile={isMobile}
          title={!email ? 'Tris Vonna-Michell' : 'studiotvm@protonmail.com'}
          toggleTitle={toggleTitle}
          years={`Works ${workTimelines.minYear}–`}
        /> */}
        <HomeHeader fromYear={workTimelines.minYear} mobile={isMobile} prologue={prologue} />
        {workTimelines.results.map((item, i) => {
          const timelineWidth = workTimelines.maxYear - workTimelines.minYear + 1;
          return (
            item.data.work_script.length > 0 && (
            <WorkTimeline
              key={item.link.id}
              handleLoad={() => handleLoad(i)}
              left={
                ((item.data.work_year_from - workTimelines.minYear) / timelineWidth)
                * 100
              }
              link={item.link}
              loaded={loaded}
              numberOfWorks={workTimelines.results.length}
              renditions={false}
              width={(item.image_width / timelineWidth) * 100}
              workPreviewImage={item.data.work_preview_image.url}
              workPreviewImageHeight={item.data.work_preview_image.dimensions.height}
              workPreviewImageWidth={item.data.work_preview_image.dimensions.width}
              workTitle={item.data.work_title[0].text}
              workYearFrom={item.data.work_year_from}
              workYearTo={item.data.work_year_to}
            />
            )
          );
        })}
        <Footer>{emailAddress}</Footer>
      </Main>
    </>
  );
};

export default Home;
