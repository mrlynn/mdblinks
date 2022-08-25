import React, { useEffect, useState } from "react";
import { css } from "@leafygreen-ui/emotion";
import { MongoDBLogo } from "@leafygreen-ui/logo";
import { H1, H2, H3, Body } from "@leafygreen-ui/typography";
import Button from "@leafygreen-ui/button";
import ReactMarkdown from 'react-markdown'


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
  p {
    grid-column: 2/span 10;
    font-size: 20px;
    color: #b8c4c2;
    padding-top: 20px;
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

  useEffect(() => {
    const getNearbyEvent = async () => {
      let event = await fetch("https://data.mongodb-api.com/app/landing-mgxlk/endpoint/getNearbyEvents").then(resp => resp.json());
      if (Array.isArray(event)) event = event[0];
      setLandingPageData({...landingPageData, nearbyEvent: event});
    }
    getNearbyEvent();
  });

  let codeAndSlidesMdBlock = `
### Code 
There's nothing like **looking** at some code to learn about a topic.
All of the code samples that were shown in this talk can be found on [Github](http://github.com/joellord/mern-k8s).

### Slides
If you want to _browse_ through the slides at your own pace, you can look at them [here](https://docs.google.com/presentation/u/1/d/1ytFSJXWACBtTNMgyFsiiyBAkPfruMiCeoQ_0QPFBQ_s/edit?usp=chrome_omnibox&ouid=110821894784085411919)
`

  let [landingPageData, setLandingPageData] = useState({
    title: "Title",
    subtitle: "Subtitle",
    summary: "This is the small summary of the landing page that will show up in the jumbotron, right under the title and subtitle. This text can expand on multiple lines.",
    ctaButton: {
      label: "Try MongoDB now",
      linkTo: "http://mongodb.com"
    },
    nearbyEvent: {
      oneliner: "Looking for a nearby event...",
      date: "",
      ctaButton: {
        label: "Check the list",
        linkTo: "http://community.mongodb.com"
      }
    },
    otherSections: [
      {title: "Find out more", text: "Learn more about this stuff"},
      {title: "Code and Slides", text: codeAndSlidesMdBlock }
    ]
  });

  return (
    <React.Fragment>
      <section className={topBannerStyle}>
        <a href="http://mongodb.com">
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
                <Button variant="baseGreen" size="large" href={landingPageData.ctaButton.linkTo}>{landingPageData.ctaButton.label}</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={mdbEventBannerStyle}>
        <H2>Want to learn more about MongoDB?</H2>
        <Body>{landingPageData.nearbyEvent.oneliner}</Body>
        <Body>
          <Button href={landingPageData.nearbyEvent.ctaButton.linkTo}>{landingPageData.nearbyEvent.ctaButton.label}</Button>
        </Body>
      </section>
      <section className={findOutMoreStyle}>
        {landingPageData.otherSections.map((s) => { return (
          <div className={findOutMoreSectionStyle} key={s.title}>
            <H2>{s.title}</H2>
            <div className={findOutMoreBodyStyle}>
              <ReactMarkdown disallowedElements={["h1", "h2"]} children={s.text}></ReactMarkdown>
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