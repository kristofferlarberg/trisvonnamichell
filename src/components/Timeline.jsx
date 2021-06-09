import React from 'react';
import { Link } from 'prismic-reactjs';
import styled from 'styled-components';
import { linkResolver } from '../prismic-configuration';
import { imgix } from '../pages/Home';

const ua = navigator.userAgent;
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);
const lineHeight = isMobile ? 10 : 17;

const LineContainer = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const Preview = styled.img`
  border-right: 1px solid black;
  border-left: 1px solid black;
  position: relative;
  display: block;
  left: ${props => (props.width > 0 ? props.left : 0)}%;
  width: ${props => (props.width > 0 ? props.width : '100')}%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
`;
const WorkLink = styled.a`
  position: relative;
  top: ${isMobile ? '0' : -lineHeight}rem;
  height: ${lineHeight}rem;
  text-decoration: none;
  color: inherit;
`;

const Line = styled.section`
  background-color: transparent;
  background-image: url(${props => props.img});
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: multiply;
  margin-bottom: 5px;
  height: ${lineHeight}rem;
  width: ${isMobile ? '100%' : '90%'};
  transition: background-color 0.3s ease-out;
  &:hover ${Preview} {
    filter: none;
  }
  &:hover {
    background-color: ${!isMobile && '#555'};
    background-blend-mode: ${!isMobile ? 'multiply' : 'normal'};
  }
`;

const HoverLine = styled.section`
  display: flex;
  top: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: ${lineHeight}rem;
  transition-duration: 0.4s;
`;

const WorkTitle = styled.h2`
  font-size: ${isMobile && '1rem'};
  line-height: ${isMobile && '1.2rem'};
  max-width: 80%;
  margin: 0 0 0.25rem 0;
  padding: ${isMobile ? '4px 8px' : '0.5rem 0.8rem'};
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

const Lines = ({
    i, handleLoad, left, link, loaded, numberOfWorks, width, workPreviewImage, workTitle, workYearFrom, workYearTo,
}) => {
    const scaleDown = `&w=${Math.round(width) / 100}`;
    return (isMobile

        ? (
            <LineContainer key={ `${i}a` } show={ loaded }>
                <Line
                    key={ `${i}b` }
                    img={ workPreviewImage + imgix }
                >
                    <WorkLink
                        key={ `${i}c` }
                        numberOfWorks={ numberOfWorks }
                        href={ Link.url(link, linkResolver) }
                    >
                        <HoverLine key={ `${i}d` }>
                            <WorkTitle key={ `${i}e` }>
                                { workTitle }
                            </WorkTitle>
                            <WorkTitle key={ `${i}f` }>
                                { workYearFrom }
                                –
                                { workYearFrom }
                            </WorkTitle>
                        </HoverLine>
                    </WorkLink>
                </Line>
            </LineContainer>
        )
        : (
            <LineContainer key={ `${i}a` } show={ loaded }>
                <Ends key={ `${i}b` }>
                    <VerticalLine />
                </Ends>
                <Line
                    key={ `${i}c` }
                    img={ workPreviewImage + imgix }
                >
                    <Preview
                        key={ `${i}c` }
                        onLoad={ handleLoad }
                        src={ workPreviewImage + scaleDown }
                        className="link_img"
                        alt={ workTitle }
                        width={ width }
                        left={ left }
                    />
                    <WorkLink
                        key={ `${i}d` }
                        numberOfWorks={ numberOfWorks }
                        href={ Link.url(link, linkResolver) }
                    >
                        <HoverLine key={ `${i}e` }>
                            <WorkTitle key={ `${i}f` }>
                                { workTitle }
                            </WorkTitle>
                            <WorkTitle key={ `${i}g` }>
                                { workYearFrom }
                                –
                                { workYearTo }
                            </WorkTitle>

                        </HoverLine>
                    </WorkLink>
                </Line>
                <Ends>
                    <VerticalLine />
                </Ends>
            </LineContainer>
        )
    );
};

export default Lines;
