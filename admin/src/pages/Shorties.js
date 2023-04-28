import React, {useEffect, useState, useCallback, useRef} from "react";
import { H2, H3, Body, Link, Label, Description, Subtitle } from "@leafygreen-ui/typography";
import { Table, TableHeader, Row, Cell } from '@leafygreen-ui/table';
import { Tabs, Tab } from "@leafygreen-ui/tabs";
import Copyable from "@leafygreen-ui/copyable";
import Card from "@leafygreen-ui/card";
import Toggle from "@leafygreen-ui/toggle";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import Modal from "@leafygreen-ui/modal";
import TextInput from '@leafygreen-ui/text-input';
import Checkbox from '@leafygreen-ui/checkbox';
import Button from "@leafygreen-ui/button";
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';
import { spacing } from '@leafygreen-ui/tokens';
import InlineDefinition from "@leafygreen-ui/inline-definition";
import { useRealm } from "../providers/Realm";
import { css } from "@leafygreen-ui/emotion";
import { useAuth0 } from "@auth0/auth0-react";

import * as QRCode from "qrcode";

const TRUNCATE_LENGTH = 50;
const ERROR_MESSAGES = {
  START_WITH_SLASH: "Route must start with a forward slash (/)",
  ALREADY_EXISTS: "Route is already used for another URL"
}

export default function Routes () {
  let [insertModalOpened, setInsertModalOpened] = useState(false);
  let [qrCodeModalOpened, setQrCodeModalOpened] = useState(false);
  let [qrCodeDestination, setQrCodeDestination] = useState("");
  let [chartModalOpened, setChartModalOpened] = useState(false);
  let [chartRoute, setChartRoute] = useState("");
  let [routeStats, setRouteStats] = useState({});
  let [route, setRoute] = useState("");
  let [routeValid, setRouteValid] = useState(true);
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [to, setTo] = useState("");
  let [isPublic, setIsPublic] = useState(false);
  let [data, setData] = useState([]);
  let [modalMode, setModalMode] = useState("add");
  let [landings, setLandings] = useState([]);
  let [showMyRoutes, setShowMyRoutes] = useState(true);
  let [errorMessage, setErrorMessage] = useState(ERROR_MESSAGES.START_WITH_SLASH);
  let [allRoutes, setAllRoutes] = useState([]);
  let { realmUser } = useRealm();
  let currentUserId = realmUser?.id;

  const { user } = useAuth0();

  let [url, setURL] = useState("");
  let [campaign, setCampaign] = useState("devrel");
  let [source, setSource] = useState("");
  let [medium, setMedium] = useState("");
  let [content, setContent] = useState("");
  let [term, setTerm] = useState(user?.nickname);
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
    setTo(trueURL);
  }, [url, campaign, source, medium, content, term]);

  const sources = [
    {value: "event", displayName: "Events"},
    {value: "podcast", displayName: "Podcasts"},
    {value: "youtube", displayName: "Youtube"},
    {value: "social", displayName: "Social Media (LinkedIn, Twitter, Instagram ,...)"},
    {value: "cross-post", displayName: "Cross-Post"}
  ];

  const mediums = [
    {value: "print", displayName: "Printed Handouts"},
    {value: "shownotes", displayName: "Podcast or Youtube Show Notes"},
    {value: "cta", displayName: "Call To Action link"}
  ];

  const LINKTYPES = {UTM: "UTM", LANDING: "LANDING", DIRECT: "DIRECT"};
  let [ linkType, setLinkType ] = useState(LINKTYPES.UTM);


  const qrCodeModalStyle = css`
    text-align: center;
  `

  const chartModalStyle = css`

  `

  const topBarStyle = css`
    text-align: right;
  `

  const toggleButtonStyle = css`
    padding-right: 30px;
    display: block;
    float: left;
    text-align: left;
  `;

  const tabCardStyle = css`
    margin-top: 10px;
  `

  const copyableInputStyle = css`
    width: 100%;
  `

  const visible = css`
    display: inherit;
  `

  const invisible = css`
    display: none;
  `

  const canvasRef = useRef(null);

  const getData = useCallback(async () => {
    if(!realmUser) return;
    let results = await realmUser.functions.getAllRoutes();
    setData(results);
    setAllRoutes(results.map(r => r.route));
  }, [realmUser]);

  const getLandings = useCallback(async () => {
    if (!realmUser) return;
    let results = await realmUser.functions.getAllLandings();
    setLandings(results);
  }, [realmUser]);

  const handleDelete = async (id) => {
    await realmUser.functions.deleteRoute(id);
    getData();
  }

  const handleModalConfirm = async() => {
    let newRoute = {route, to, title, description, isPublic};
    if (modalMode === "add") await realmUser.functions.insertRoute(newRoute);
    if (modalMode === "edit") await realmUser.functions.updateRoute(newRoute);
    await getData();
    emptyForm();
    setInsertModalOpened(false);
    setModalMode("add");
  }

  const showQrCode = async (route) => {
    await setQrCodeModalOpened(true);
    setQrCodeDestination(`mdb.link${route}`);
    let destinationUrl = `https://mdb.link${route}`;
    let canvas = canvasRef.current;
    QRCode.toCanvas(canvas, destinationUrl, {width: 480, color: {dark: "#023430"}}, function (error) {
      if (error) console.error(error);
    });
  }

  const showChartModal = async (route) => {
    setChartModalOpened(true);
    setChartRoute(route);
    let stats = await realmUser.functions.getRouteStats(route);
    setRouteStats(stats);
  }

  const emptyForm = () => {
    setRoute("");
    setTo("");
    setDescription("");
    setTitle("");
    setIsPublic(false);
    setURL("");
    setCampaign("devrel");
    setSource("");
    setMedium("");
    setContent("");
    setTerm(user?.nickname);
    setUrlValid(true);
    setLinkWithUTM("");
  }

  const editRoute = (route) => {
    let editRoute = data.find(r => r.route === route);
    setRoute(editRoute.route);
    setTo(editRoute.to);
    setDescription(editRoute.description);
    setTitle(editRoute.title);
    setIsPublic(editRoute.isPublic);

    setInsertModalOpened(true);
    setModalMode("edit");

    //Route type
    if (editRoute.to.match(/\?utm_campaign=devrel/)) {
      const url = new URL(editRoute.to);
      const params = new URLSearchParams(url.searchParams);
      setLinkType(LINKTYPES.UTM);
      setURL(url.origin + url.pathname);
      setCampaign(params.get("utm_campaign"));
      setSource(params.get("utm_source"));
      setMedium(params.get("utm_medium"));
      setContent(params.get("utm_content"));
      setTerm(params.get("utm_term"));
    } else if (editRoute.to.match(/landing.mdb.link/)) {
      setLinkType(LINKTYPES.LANDING);
    } else {
      setLinkType(LINKTYPES.DIRECT);
    }
  }

  const handleLandingChange = (value) => {
    if (!value) {
      emptyForm();
      return;
    }

    let landing = landings.find(l => l.identifier === value);
    setTo(`https://landing.mdb.link/${landing.identifier}`);
    setTitle(landing.title);
    setDescription(landing.summary);
  }

  useEffect(() => {
    getData();
    getLandings();

  }, [getData, getLandings]);

  return  (
    <React.Fragment>
      <H2>List of Short URLs</H2>

      <p className={topBarStyle}>
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
              onChange={(checked) => setShowMyRoutes(checked)}
              checked={showMyRoutes}
            />
          </div>
        </div>
        <div>
          <Button
            onClick={() => setInsertModalOpened(true)}
            variant="primary"
            leftGlyph={<Icon glyph="Plus" />}
          >
            Insert New Short URL
          </Button>
        </div>
      </p>

      <ConfirmationModal
        open={insertModalOpened}
        onConfirm={handleModalConfirm}
        onCancel={() => { setInsertModalOpened(false); emptyForm(); }}
        title="Add New Short URL"
        buttonText="Save New Shortie"
        submitDisabled={!routeValid}
      >
        Create a new short route here.
        <TextInput
          label="Short Route"
          description="Route starting with '/'"
          placeholder="/route"
          onChange={e => {
            setRoute(e.target.value);
            if (e.target.value.substring(0,1) !== "/") {
              setRouteValid(false);
              setErrorMessage(ERROR_MESSAGES.START_WITH_SLASH);
            } else if (allRoutes.includes(e.target.value)) {
              setRouteValid(false);
              setErrorMessage(ERROR_MESSAGES.ALREADY_EXISTS);
            } else {
              setRouteValid(true);
            }
          }}
          errorMessage={errorMessage}
          state={routeValid ? "valid" : "error"}
          value={route}
          disabled={modalMode === "edit"}
        />

        <Tabs>

          <Tab name="With UTM codes" default={linkType === LINKTYPES.UTM} aria-label="With UTM">
            <Card className={tabCardStyle}>
              <Subtitle>Generate a mongodb.com link with UTMs</Subtitle>
              <Body>
                <TextInput
                  label="URL"
                  description="This should be a page on the MongoDB website"
                  placeholder="mongodb.com/..."
                  onChange={e => {
                    setURL(e.target.value);
                    if (!url.match(/mongodb\.com/)) {
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
                  description="Should always be set to `devrel`"
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
                <Copyable className={copyableInputStyle} label="Your Link" description="Use this link to start tracking your impact.">
                  {linkWithUTM}
                </Copyable>
              </Body>
            </Card>
          </Tab>

          <Tab name="From mdb.link landing page" default={linkType === LINKTYPES.LANDING} aria-label="From Landing">
            <Card className={tabCardStyle}>
              <Subtitle>From a mdb.link landing page</Subtitle>
              <Body>

                <Combobox
                  label="Populate from landing page"
                  description="Select a landing page to pre-populate fields"
                  placeholder="New page"
                  onChange={handleLandingChange}
                >
                  {landings.map(l => {
                    return(
                      <ComboboxOption value={l.identifier} displayName={`${l.identifier} - ${l.title}`} />
                    )
                  })}
                </Combobox>

              </Body>
            </Card>
          </Tab>

          <Tab name="Direct link" default={linkType === LINKTYPES.DIRECT} aria-label="Direct Link">
            <Card className={tabCardStyle}>
              <Subtitle>Link directly to another page</Subtitle>
              <Body>

                <TextInput
                  label="Destination"
                  description="Enter a destination URL"
                  placeholder="https://example.com"
                  onChange={e => setTo(e.target.value)}
                  value={to}
                />

              </Body>
            </Card>
          </Tab>
        </Tabs>

        <span style={{ margin: spacing[3] }}>

        </span>

        <Checkbox
          onChange={e => setIsPublic(!isPublic)}
          label="Is this item public?"
          description="If set as public, this route will be shown in the directory on http://mdb.link or when no match is found."
          checked={isPublic}
        />

        <Card className={isPublic ? visible : invisible}>
          <TextInput
            label="Title"
            description="Shown in the public list when no match is found"
            placeholder=""
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
          <TextInput
            label="Description"
            description="Shown in the link previews"
            placeholder=""
            onChange={e => setDescription(e.target.value)}
            value={description}
          />
        </Card>
      </ConfirmationModal>

      <Modal open={qrCodeModalOpened} setOpen={setQrCodeModalOpened} className={qrCodeModalStyle}>
        <H3>QR Code for {qrCodeDestination}</H3>
        <canvas ref={canvasRef} width="300"></canvas>
      </Modal>

      <Modal open={chartModalOpened} setOpen={setChartModalOpened} className={chartModalStyle}>
        <H3>Stats for {chartRoute}</H3>
        <Body>
          Number of visitors in the last 7 days: {routeStats?.stats?.visits || "0"}<br/>
          Number of visitors in the last 30 days: {routeStats?.stats?.visits30 || "0"}<br/>
          Number of visitors all time: {routeStats?.stats?.visitsAllTime || "0"}<br/>
        </Body>
        <Body>
          Top referrers:
          <ul>
            {(routeStats?.stats?.topReferrers || []).map(r => {
              return (
                <li>{r._id} ({r.count})</li>
              )
            })}
          </ul>
        </Body>
      </Modal>

      <Table
        data={data}
        columns={[
          <TableHeader label="Short URL"  sortBy={datum => datum.route}/>,
          <TableHeader label="Destination"  sortBy={datum => datum.to}/>,
          <TableHeader label="Title"  sortBy={datum => datum.title}/>,
          <TableHeader label="Public" />,
          <TableHeader label="Actions" />
        ]}
      >
        {({ datum }) => {
          if (showMyRoutes && datum.owner !== currentUserId) return;
          return (
          <Row key={datum._id}>
            <Cell><Link href={`https://mdb.link${datum.route}`} rel="noreferrer" target="_blank">{datum.route}</Link></Cell>
            <Cell>
              <InlineDefinition definition={datum.to}>
                <Link href={datum.to} rel="noreferrer" target="_blank">{`${datum.to.substr(0, TRUNCATE_LENGTH)}${datum.to.length > TRUNCATE_LENGTH ? "..." : ""}`}</Link>
              </InlineDefinition>
            </Cell>
            <Cell>{datum.title || " "}</Cell>
            <Cell>{datum.isPublic ? "Yes" : "No"}</Cell>
            <Cell>
              {currentUserId === datum.owner &&
              <IconButton darkMode={true} aria-label="Delete" onClick={() => handleDelete(datum._id.toString())}>
                <Icon glyph="Trash" fill="#aa0000" />
              </IconButton>
              }
              {currentUserId === datum.owner &&
              <IconButton aria-label="Edit" onClick={() => editRoute(datum.route)}>
                <Icon glyph="Edit" />
              </IconButton>
              }
              <IconButton darkMode={true} aria-label="QRCode" onClick={() => showQrCode(datum.route)}>
                <Icon glyph="Sweep" />
              </IconButton>
              <IconButton darkMode={true} aria-label="Chart" onClick={() => showChartModal(datum.route)}>
                <Icon glyph="Charts" />
              </IconButton>
            </Cell>
          </Row>
        )
        }}
      </Table>
    </React.Fragment>
  )
}