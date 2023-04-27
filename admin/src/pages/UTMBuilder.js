import React, { useState, useEffect } from "react";
import { H2 } from "@leafygreen-ui/typography";
import TextInput from '@leafygreen-ui/text-input';
import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';
import Copyable from "@leafygreen-ui/copyable";
import { css } from "@leafygreen-ui/emotion";
import { useAuth0 } from "@auth0/auth0-react";

export default function Home () {
  const { user } = useAuth0();

  let [url, setURL] = useState("");
  let [campaign, setCampaign] = useState("devrel");
  let [source, setSource] = useState("");
  let [medium, setMedium] = useState("");
  let [content, setContent] = useState("");
  let [term, setTerm] = useState(user.nickname);
  let [urlValid, setUrlValid] = useState(true);
  let [linkWithUTM, setLinkWithUTM] = useState("");

  useEffect(() => {
    let trueURL = url;
    if (url && !trueURL.match(/http[s?]/)) trueURL = "https://" + trueURL;
    trueURL = trueURL.replace("http://", "https://");

    if (campaign || source || medium || content || term) {
      trueURL = trueURL + "?";
      if (campaign) trueURL = `${trueURL}utm_campaign=${encodeURIComponent(campaign)}&`;
      if (source) trueURL = `${trueURL}utm_source=${encodeURIComponent(source)}&`;
      if (medium) trueURL = `${trueURL}utm_medium=${encodeURIComponent(medium)}&`;
      if (content) trueURL = `${trueURL}utm_content=${encodeURIComponent(content)}&`;
      if (term) trueURL = `${trueURL}utm_term=${encodeURIComponent(term)}&`;
    }
    if (trueURL.slice(-1) === "&") trueURL = trueURL.substring(0, trueURL.length-1);
    setLinkWithUTM(trueURL);
  }, [url, campaign, source, medium, content, term]);

  const sources = [
    {value: "event", displayName: "Events"},
    {value: "workshop", displayName: "Workshops"},
    {value: "podcast", displayName: "Podcasts"},
    {value: "youtube", displayName: "Youtube"},
    {value: "social", displayName: "Social Media (LinkedIn, Twitter, Instagram ,...)"},
    {value: "cross-post", displayName: "Cross-Post"}
  ];

  const mediums = [
    {value: "print", displayName: "Printed Handouts"},
    {value: "shownotes", displayName: "Podcast or YouTube Show Notes"},
    {value: "cta", displayName: "Call To Action Link"}
  ]

  const formStyle = css`
    margin: 0px 50px;
    max-width: 50em;
  `

  const copyableStyle = css`
    margin: 0px 50px;
    width: 50em;
  `

  const copyableInputStyle = css`
    width: 50em;
  `

  return  (
    <React.Fragment>
      <H2>UTM Link Builder</H2>

      <p>
        <div>
          Fill the following form to build your URL with UTM codes
        </div>
      </p>

      <p>
        <form className={formStyle}>
          <TextInput
            label="URL"
            description="This should be a page on the MongoDB website"
            placeholder="mongodb.com/..."
            onChange={e => {
              setURL(e.target.value);
              if (!e.target.value.match(/mongodb\.com/)) {
                setUrlValid(false);
              } else {
                setUrlValid(true);
              }
            }}
            errorMessage="URL must be leading to a MongoDB website"
            state={urlValid ? "valid" : "error"}
            value={url}
          /><br/>
          <TextInput
            label="Campaign"
            description="Should always be set to ‘devrel’"
            onChange={e => setCampaign(e.target.value)}
            disabled={true}
            value={campaign}
          /><br/>
          <Combobox
            label="Source"
            description="Focus area this link tracks to"
            onChange={value => setSource(value)}
            value={source}
          >
            {sources.map(s => <ComboboxOption {...s} />)}
          </Combobox><br/>
          <Combobox
            label="Medium"
            description="How was the link shared?"
            onChange={value => setMedium(value)}
            value={medium}
          >
            {mediums.map(s => <ComboboxOption {...s} />)}
          </Combobox><br/>
          <TextInput
            label="Content"
            description="More details to the medium (episode number, video title, conference name)"
            onChange={e => setContent(e.target.value)}
            value={content}
          /><br/>
          <TextInput
            label="Term"
            description="Used to identify who used or created this link"
            onChange={e => setTerm(e.target.value)}
            value={term}
          /><br/>
        </form>
      </p>
      <p className={copyableStyle}>
        <Copyable className={copyableInputStyle} label="Your Link" description="Use this link to start tracking your impact.">
          {linkWithUTM}
        </Copyable>
      </p>
    </React.Fragment>
  )
}