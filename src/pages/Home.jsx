import React, {useEffect, useState} from 'react';
import Prismic from 'prismic-javascript';
import {RichText} from 'prismic-reactjs';
import styled from 'styled-components';
import {useQuery} from 'react-query';

import {client} from '../prismic-configuration';
import GlobalStyle from '../styles/global';
import HomeHeader from '../components/HomeHeader';
import NotFound from './NotFound';
import Spinner from '../components/Spinner';
import WorkTimeline from '../components/WorkTimeline';

const Main = styled.main`
  margin: 2rem;
  width: calc(100% - 4rem);
  height: auto;
  opacity: ${props => (props.loaded ? '1' : '0')};
  transition: opacity 0.5s ease-in;
  @media (max-width: 768px) {
    margin: 5px 5px 40px 5px;
    width: calc(100% - 10px);
  }
`;
const Footer = styled.footer`
  color: var(--offwhite);
  margin-top: 2rem;
  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const imgixGreen = '&sat=-50&exp=0&invert=true&monochrome=c5c&con=-50';
export const imgixOrange = '&sat=-30&exp=0&invert=true&monochrome=28f&con=-50';

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const allLoaded = [];
  const [isMobile, setMobile] = useState(window.innerWidth < 768);

  const handleResize = () => {
    if (window.innerWidth < 768) setMobile(true);
    else setMobile(false);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  });

  const getWorks = async () => {
    const works = await client.query(
      Prismic.Predicates.at('document.type', 'work'),
      {orderings: '[my.work.order, my.work.work_year_to desc]'},
    );
    return works;
  };

  const getInformation = async () => {
    const information = await client.getSingle('information');
    return information;
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

  const workTimelinesQuery = useQuery('workTimelines', createWorkTimelines);
  const informationQuery = useQuery('information', getInformation);

  const handleLoad = (i) => {
    if (allLoaded.length === 0) {
      workTimelinesQuery.data.results.forEach((work) => {
        if (work.data.work_preview_image.url !== '') {
          allLoaded.push(false);
        }
      });
    }
    allLoaded[i] = true;
    if (allLoaded.every(value => value)) {
      setLoaded(true);
    }
  };

  if (isMobile && workTimelinesQuery.isSuccess && informationQuery.isSuccess) {
    setTimeout(() => {
      setLoaded(true);
    }, 250);
  }

  if (workTimelinesQuery.isError || informationQuery.isError) {
    return <NotFound />;
  }

  if (workTimelinesQuery.isLoading || informationQuery.isLoading) {
    return (<Spinner />);
  }

  const workTimelines = workTimelinesQuery.data;
  const information = informationQuery.data.data;

  return (
    <>
      <Main loaded={loaded} mobile={isMobile}>
        <GlobalStyle />
        <HomeHeader fromYear={workTimelines.minYear} hiddenHeader information={information} mobile={isMobile} />
        <HomeHeader fromYear={workTimelines.minYear} information={information} mobile={isMobile} />
        {workTimelines.results.map((work, i) => {
          const timelineWidth = workTimelines.maxYear - workTimelines.minYear + 1;
          return (
            <WorkTimeline
              key={work.link.id}
              artist={work.data.artist}
              handleLoad={() => handleLoad(i)}
              left={
                ((work.data.work_year_from - workTimelines.minYear) / timelineWidth)
                * 100
              }
              link={work.link}
              loaded={loaded}
              mobile={isMobile}
              numberOfWorks={workTimelines.results.length}
              renditions={false}
              width={(work.image_width / timelineWidth) * 100}
              workPreviewImage={work.data.work_preview_image.url}
              workPreviewImageHeight={work.data.work_preview_image.dimensions.height}
              workPreviewImageWidth={work.data.work_preview_image.dimensions.width}
              workTitle={work.data.work_title[0].text}
              workYearFrom={work.data.work_year_from}
              workYearTo={work.data.work_year_to}
            />
          );
        })}
        <Footer>{RichText.asText(information.email)}</Footer>
      </Main>
    </>
  );
};

export default Home;
