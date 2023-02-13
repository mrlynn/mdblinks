import React, { useEffect, useState } from "react";
import { css } from "@leafygreen-ui/emotion";
import { MongoDBLogo } from "@leafygreen-ui/logo";
import { H1, H2, H3, Body } from "@leafygreen-ui/typography";
import Card from '@leafygreen-ui/card';
import Button from "@leafygreen-ui/button";
import Icon from '@leafygreen-ui/icon';

import ReactMarkdown from 'react-markdown'
import { useParams } from "react-router-dom";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import '../carousel.css';


let topBannerStyle = css`
  position: sticky;
  top: 0;
  background-color: #001E2B;
  text-align: center;
  padding: 15px;
`

const jumbotronStyle = css`
  background: url(https://webimages.mongodb.com/_com_assets/cms/ku4f5zfi0f5p6my97-bottom-right.svg?auto=format%252Ccompress) bottom -1px right,url(https://webimages.mongodb.com/_com_assets/cms/kufuao5jmmboc9uzm-lower-left.svg?auto=format%252Ccompress) bottom -1px left;
  background-color: #001E2B;
  background-repeat: no-repeat;
  min-height: 300px;
  margin-bottom: 60px;
`

const jumbotronInnerStyle = css`
  text-align: center;
  padding-top: 64px;
  padding-bottom: 112px;
  color: white;
`

const titleWhiteStyle = css`
  font-size: 96px;
  line-height: 112px;
  color: white;
`

const titleGreenStyle = css`
  font-size: 64px;
  line-height: 72px;
  color: #00ED64;
`

const jumbotronBoxStyle = css`
  margin-top: 40px;
  font-size: 20px;
  line-height: 32px;
  color: #b8c4c2;
`

const ctaButtonStyle = css`
  margin-top: 40px;
`

const mdbEventBannerStyle = css`
  width: 100%;
  background-color: #00684a;
  color: white;
  text-align: center;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  h2 {
    grid-column: 2/span 10;
    color: white;
  }
  h3 {
    grid-column: 2/span 10;
  }
  p {
    grid-column: 3/span 8;
    font-size: 20px;
    color: #b8c4c2;
    padding-top: 20px;
  }
`

const additionalResourcesStyle = css`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`

const additionalResourcesSectionStyle = css`
  grid-column: 4/span 6;
  margin-top: 50px;
  width: 100%;
  h2 {
    padding-bottom: 20px;
  }
`

const cardStyle = css`
  text-align: center;
  display: grid;
  grid-row-gap: 10px;
  div {
    grid-template-rows: auto;
  }
`

const findOutMoreStyle = css`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  max-width: 100%;
`

const findOutMoreSectionStyle = css`
  grid-column: 4/span 6;
  margin-top: 50px;
  h2 {
    padding-bottom: 20px;
  }
  p {
    padding-top: 10px;
    padding-bottom: 10px
  }
`

const findOutMoreBodyStyle = css`
  font-size: 20px;
  line-height: 32px;
`

const footerStyle = css`
  margin-top: 20px;
  padding: 20px;
  border-top: 1px solid rgb(231, 238, 236);
`

export default function Landing() {
  let params = useParams();
  let [landingPageData, setLandingPageData] = useState({
    title: "Title",
    subtitle: "Subtitle",
    summary: "This is the small summary of the landing page that will show up in the jumbotron, right under the title and subtitle. This text can expand on multiple lines.",
    ctaButton: {
      label: "Try MongoDB now",
      linkTo: "http://mongodb.com"
    },
    otherSections: [
    ]
  });
  let [nearbyEvent, setNearbyEvent] = useState({});

  const addUtms = (link) => {
    if(link.match("utm")) return link;
    const campaign = "devrel";
    const source = "event";
    const medium = "cta";
    const content = params.identifier;

    link += `?utm_campaign=${campaign}&utm_source=${source}&utm_medium=${medium}&utm_content=${content}`;
    return link;
  }

  useEffect(() => {
    const getLanding = async () => {
      let landing = await fetch(`https://data.mongodb-api.com/app/landing-mgxlk/endpoint/landing?identifier=${params.identifier}`).then(resp => resp.json());
      setLandingPageData(landing);
    }
    if (window.landingData) {
      setLandingPageData(window.landingData);
    } else {
      getLanding();
    }
  }, [params]);

  useEffect(() => {
    const getNearbyEvent = async () => {
      let event = await fetch("https://data.mongodb-api.com/app/landing-mgxlk/endpoint/getNearbyEvents").then(resp => resp.json());
      if (Array.isArray(event)) event = event[0];
      setNearbyEvent(event);
    }
    getNearbyEvent();
  }, [landingPageData]);

  return (
    <React.Fragment>
      <section className={topBannerStyle}>
        <a href={addUtms("http://mongodb.com")}>
          <MongoDBLogo color="white" height={30} />
        </a>
      </section>
      <section className={jumbotronStyle}>
        <div className={jumbotronInnerStyle}>
          <div style={{display: "grid", gridTemplateColumns: "repeat(12, 1fr)"}}>
            <div style={{gridColumn: "2/span 10"}}>
              <H1 className={titleWhiteStyle}>{landingPageData.title}</H1>
              <H2 className={titleGreenStyle}>{landingPageData.subtitle}</H2>
            </div>
            <div style={{gridColumn: "4/span 6"}}>
              <Body className={jumbotronBoxStyle}>
                {landingPageData.summary}
              </Body>
            </div>
            <div style={{gridColumn: "6/span 2"}}>
              <div className={ctaButtonStyle}>
                <Button variant="baseGreen" size="large" href={addUtms(landingPageData.ctaButton.linkTo)}>{landingPageData.ctaButton.label}</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={mdbEventBannerStyle}>
        <H2>Want to learn more about MongoDB?</H2>
        <H3>{nearbyEvent?.oneliner || "Looking for nearby events"}</H3>
        <Body>{nearbyEvent?.details}</Body>
        <Body>
          {nearbyEvent?.ctaButton &&
            <Button href={addUtms(nearbyEvent.ctaButton.linkTo)}>{nearbyEvent.ctaButton.label}</Button>
          }
        </Body>
      </section>
      <section className={findOutMoreStyle}>
        {landingPageData.otherSections.slice(0, 1).map((s) => {
          return (
          <div className={findOutMoreSectionStyle} key={s.title}>
            <H2>{s.title}</H2>
            <div className={findOutMoreBodyStyle}>
              <ReactMarkdown disallowedElements={["h1", "h2"]} children={s.content}></ReactMarkdown>
            </div>
          </div>
        )})}
      </section>
      <section className={additionalResourcesStyle}>
        <div className={additionalResourcesSectionStyle}>
          <H2>Additional Resources</H2>
          <AliceCarousel infinite mouseTracking responsive={{
            0: {
                items: 1,
            },
            1024: {
                items: 3
            }
          }} items={landingPageData?.additionalResources?.map((r, i) => {
            let type = "default";
            if (r.link.includes("mongodb.com/developer")) type = "devcenter";
            if (r.link.includes("youtube.com")) type = "video";
            let iconGlyph;
            let linkText;
            switch(type) {
              case "video":
                iconGlyph = "Megaphone";
                linkText = "Check out the video";
                break;
              case "devcenter":
                iconGlyph = "Code";
                linkText = "Developer Center";
                break;
              default:
                iconGlyph = "InfoWithCircle";
                linkText = "Learn More";
            }
            return (
              <Card key={i} className={cardStyle}>
                <div>
                  <Icon glyph={iconGlyph} size="xlarge" />
                </div>
                <div>
                  {r.title}
                </div>
                <div>
                  <a href={addUtms(r.link)} rel="noreferrer" target="_blank">{linkText}</a>
                </div>
              </Card>
            )
          })} />

        </div>
      </section>
      <section className={findOutMoreStyle}>
        {landingPageData.otherSections.slice(1).map((s) => {
          return (
          <div className={findOutMoreSectionStyle} key={s.title}>
            <H2>{s.title}</H2>
            <div className={findOutMoreBodyStyle}>
              <ReactMarkdown disallowedElements={["h1", "h2"]} children={s.content}></ReactMarkdown>
            </div>
          </div>
        )})}
      </section>
      <section className={footerStyle}>
        <MongoDBLogo height={20} />
      </section>
    </React.Fragment>
  )
}