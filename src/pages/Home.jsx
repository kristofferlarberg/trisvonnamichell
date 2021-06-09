import React, { useState } from 'react';
import Prismic from 'prismic-javascript';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { client } from '../prismic-configuration';
import NotFound from './NotFound';
import GlobalStyle from '../styles/global';
import Nav from '../components/Nav';
import Lines from '../components/Timeline';

const ua = navigator.userAgent;
export const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);
export const imgix = '&w=0.5&sat=-50&exp=0&invert=true&monochrome=c5c&con=-50&monochrome=%23862e9c';

const Main = styled.main`
  margin: ${props => (props.mobile ? '0 5px 40px 5px' : '0 2rem 4rem 2rem')};
  width: ${props => (props.mobile ? 'calc(100% - 10px)' : 'calc(100% - 4rem)')};
  height: auto;
  opacity: ${props => (props.loaded ? '1' : '0')};
  transition: opacity 0.5s ease-in;
`;
const Loading = styled.p`
  color: #fff;
  margin: 32px 0 0 32px;
  font-family: "PT-Regular", sans-serif;
  font-size: 1.05rem;
`;

const Home = () => {
    const [loaded, setLoaded] = useState(false);
    const allLoaded = [];
    const [email, setEmail] = useState(false);
    const toggleTitle = () => {
        setEmail(!email);
    };

    const getWorks = async () => {
        try {
            const works = await client.query(
                Prismic.Predicates.at('document.type', 'work'),
                { orderings: '[my.work.order, my.work.work_year_to desc]' },
            );
            return works;
        }
        catch {
            throw new Error('No data found');
        }
    };

    const createTimelineLinks = (w) => {
        const works = w;
        works.results.forEach((work, i) => {
            const width = work.data.work_year_to - work.data.work_year_from + 1;
            const newItem = {
                ...work,
                link: {
                    id: work.id,
                    isBroken: false,
                    lang: work.lang,
                    link_type: 'Document',
                    slug: work.slugs[0],
                    tags: [],
                    type: work.type,
                },
                image_width: width,
            };
            works.results[i] = newItem;
        });
        return works;
    };

    const getMaxAndMinYears = (works) => {
        let maxYear = works.results[0].data.work_year_to;
        let minYear = works.results[0].data.work_year_from;
        works.results.forEach((work) => {
            minYear = work.data.work_year_from < minYear ? work.data.work_year_from : minYear;
            maxYear = work.data.work_year_to > maxYear ? work.data.work_year_to : maxYear;
        });
        return { minYear, maxYear };
    };

    async function createTimelines() {
        const works = await getWorks();
        const worksWithLinkObject = { ...createTimelineLinks(works) };
        const { minYear, maxYear } = getMaxAndMinYears(worksWithLinkObject);
        return { ...worksWithLinkObject, minYear, maxYear };
    }

    const {
        data: timelines, isError, isLoading, isSuccess,
    } = useQuery('timelines', createTimelines);

    const handleLoad = (i) => {
        if (allLoaded.length === 0) {
            timelines.results.forEach((work) => {
                if (work.data.work_script.length) {
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

    return (
        <>
            <Main loaded={ loaded } mobile={ isMobile }>
                <GlobalStyle />
                <Nav
                    mobile={ isMobile }
                    title={ !email ? 'Tris Vonna-Michell' : 'studiotvm@protonmail.com' }
                    years={ `Works ${timelines.minYear}–` }
                    toggleTitle={ toggleTitle }
                />

                { timelines.results.map((item, i) => {
                    const timelineWidth = timelines.maxYear - timelines.minYear + 1;
                    return (
                        item.data.work_script.length > 0 && (
                            <Lines
                                renditions={ false }
                                loaded={ loaded }
                                workPreviewImage={ item.data.work_preview_image.url }
                                numberOfWorks={ timelines.results.length }
                                link={ item.link }
                                workTitle={ item.data.work_title[0].text }
                                workYearFrom={ item.data.work_year_from }
                                workYearTo={ item.data.work_year_to }
                                handleLoad={ () => handleLoad(i) }
                                width={ (item.image_width / timelineWidth) * 100 }
                                left={
                                    ((item.data.work_year_from - timelines.minYear) / timelineWidth)
                                    * 100
                                }
                                key={ item.link.id }
                                id={ item.link.id }
                            />
                        )
                    );
                }) }
            </Main>
        </>
    );
};

export default Home;
