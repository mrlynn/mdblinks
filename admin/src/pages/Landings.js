import React, {useEffect, useState} from "react";
import { H2, H3, Label, Description } from "@leafygreen-ui/typography";
import Toggle from "@leafygreen-ui/toggle";
import Button from "@leafygreen-ui/button";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import Icon from "@leafygreen-ui/icon";
import TextInput from '@leafygreen-ui/text-input';
import TextArea from '@leafygreen-ui/text-area';
import ExpandableCard from '@leafygreen-ui/expandable-card';
import { Table, TableHeader, Row, Cell } from '@leafygreen-ui/table';
import IconButton from "@leafygreen-ui/icon-button";
import { useRealm } from "../providers/Realm";
import { css } from "@leafygreen-ui/emotion";
import Config from "../config";

let topbarStyle = css`
  display: grid;
  margin-top: 20px;
  margin-botton: 20px;
  grid-template-columns: 50% 50%;
  div:first {
    text-align: left;
  }
  div:last-of-type {
    text-align: right;
  }
`;

let toggleButtonStyle = css`
  padding-right: 30px;
  display: block;
  float: left;
  text-align: left;
`;

const insertFormStyle = css`
  input { 
    margin-bottom: 20px;
  }
  section {
    margin-bottom: 40px
  }
`

const otherSectionsStyle = css`
  h3 {
    display: inline-block;
  }
  > button {
    display: inline-block;
    float: right;
  }
  > div {
    margin: 20px 0;
    button {
      margin-top: 20px;
    }
  }
`

export default function Landings () {
  const { realmUser } = useRealm();
  let currentUserId = realmUser?.id;

  useEffect(() => {
    const fetchLandings = async () => {
      let result = await realmUser.functions.getAllLandings();
      setLandings(result);
    }
    fetchLandings();
  }, [realmUser]);

  let [showMyLandings, setShowMyLandings] = useState(true);
  let [insertModalOpened, setInsertModalOpened] = useState(false);
  let [landings, setLandings] = useState([]);
  
  // New Landing form
  let [identifier, setIdentifier] = useState("");  
  let [identifierState, setIdentifierState] = useState("none");
  let [title, setTitle] = useState("");
  let [subtitle, setSubtitle] = useState("");
  let [summary, setSummary] = useState("");
  let [ctaLabel, setCtaLabel] = useState("Try MongoDB Now");
  let [ctaLink, setCtaLink] = useState("https://mongodb.com");
  let [otherSections, setOtherSections] = useState([{title: "Other content", content: ""}]);

  const handleNewSection = () => {
    setOtherSections([...otherSections, {title: "New Section", content: ""}])
  }

  const removeSection = (index) => {
    setOtherSections([...otherSections.slice(0, index), ...otherSections.slice(index + 1)])
  }

  const sectionTitleChange = (index, value) => {
    let sections = otherSections.map((s, i) => {
      if (i === index) s.title = value;
      return s;
    });
    setOtherSections(sections);
  }

  const sectionContentChange = (index, value) => {
    let sections = otherSections.map((s, i) => {
      if (i === index) s.content = value;
      return s;
    });
    setOtherSections(sections);
  }

  const handleIdentifierChange = value => {
    setIdentifierState(value.match(/^[a-z-]*$/) ? "valid" : "error");
    setIdentifier(value);
  }

  const saveNewLanding = () => {
    const ctaButton = {label: ctaLabel, linkTo: ctaLink};
    const landing = { title, subtitle, summary, ctaButton, otherSections, identifier };
    realmUser.functions.insertLanding(landing);
    setInsertModalOpened(false);
  }

  return(
    <React.Fragment>
      <H2>List of landing pages</H2>
      <section className={topbarStyle}>
        <div>
          <div className={toggleButtonStyle}>
            <Label id="toggleLabel" htmlFor="myLandingsToggle">
              Show Mine
            </Label>
            <Description>Show only landing pages that I have created</Description>
          </div>
          <div style={{display: "block", float: "left"}}>
            <Toggle
              id="myLandingsToggle"
              aria-labelledby="toggleLabel"
              onChange={(checked) => setShowMyLandings(checked)}
              checked={showMyLandings}
            />
          </div>
        </div>
        <div>
          <Button 
            onClick={() => setInsertModalOpened(true)}
            variant="primary"
            leftGlyph={<Icon glyph="Plus" />}
          >
            Create New Landing Page
          </Button>
        </div>
      </section>
      
      <ConfirmationModal 
        open={insertModalOpened}
        onCancel={() => setInsertModalOpened(false)}
        title="Create a landing page"
        buttonText="Save"
        onConfirm={saveNewLanding}
      >
        <form className={insertFormStyle}>
          <section>
            <H3>Internal</H3>
            <TextInput
              label="Internal Identifier"
              description="Used only by this application so you can recognize this landing page, and as the URL."
              value={identifier}
              errorMessage="You may only use lowercase letters and hypens."
              state={identifierState}
              onChange={e => handleIdentifierChange(e.target.value)} />
          </section>
          <section>
            <H3>Page header</H3>
            <TextInput label="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <TextInput optional={true} label="Subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
            <TextArea label="Summary" value={summary} onChange={e => setSummary(e.target.value)} />
          </section>
          <section>
            <H3>CTA Button</H3>
            <TextInput label="Label" value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} />
            <TextInput label="Link To" value={ctaLink} onChange={e => setCtaLink(e.target.value)} />
          </section>
          <section className={otherSectionsStyle}>
            <H3>Page content</H3>
            <Button onClick={handleNewSection} variant="primaryOutline" leftGlyph={<Icon glyph="Plus" />}>Add Section</Button>
            {otherSections.map((section, index) => {
                return(
                  <ExpandableCard
                    title={section.title}
                  >
                    <TextInput label="Section Title" value={section.title} onChange={(e) => sectionTitleChange(index, e.target.value)}/>
                    <TextArea 
                      label="Summary" 
                      description="Support for full markdown. Use H3 (### section title) for sub headers." 
                      value={section.content} onChange={(e) => sectionContentChange(index, e.target.value)}
                    />
                    <Button onClick={() => removeSection(index)} variant="dangerOutline" leftGlyph={<Icon glyph="Trash" />}>Remove Section</Button>
                  </ExpandableCard>
                )
              })}
          </section>
        </form>
      </ConfirmationModal>

      <Table
        data={landings}
        columns={[
          <TableHeader label="Identifier"  sortBy={datum => datum.identifier}/>,
          <TableHeader label="Title"  sortBy={datum => datum.title}/>,
          <TableHeader label="Actions" />
        ]}
      >
        {({ datum }) => (
          <Row key={datum._id}>
            <Cell>{datum.identifier}</Cell>
            <Cell>{datum.title || " "}</Cell>
            <Cell>
              {currentUserId === datum.owner && 
              <IconButton darkMode={true} aria-label="Delete">
                <Icon glyph="Trash" fill="#aa0000" />
              </IconButton>
              }
              <IconButton aria-label="Preview" href={`${Config.LANDING.URL}/${datum.identifier}`} target="_blank">
                <Icon glyph="Link" />
              </IconButton>
            </Cell>
          </Row>
        )}
      </Table>
    </React.Fragment>
  )
}