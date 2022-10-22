import React, {useEffect, useState, useCallback, useRef} from "react";
import { H2, H3, Body, Link, Label, Description } from "@leafygreen-ui/typography";
import { Table, TableHeader, Row, Cell } from '@leafygreen-ui/table';
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
import { useRealm } from "../providers/Realm";
import { css } from "@leafygreen-ui/emotion";

import * as QRCode from "qrcode";

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
  let [isPublic, setIsPublic] = useState(true); 
  let [data, setData] = useState([]);
  let [modalMode, setModalMode] = useState("add");
  let [landings, setLandings] = useState([]);
  let [showMyRoutes, setShowMyRoutes] = useState(true);

  let { realmUser } = useRealm();
  let currentUserId = realmUser?.id;

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

  const canvasRef = useRef(null);

  const getData = useCallback(async () => {
    if(!realmUser) return;
    let results = await realmUser.functions.getAllRoutes(); 
    setData(results);
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
    setIsPublic(true);
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
        onCancel={() => setInsertModalOpened(false)}
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
            if (route.substring(0,1) !== "/") {
              setRouteValid(false);
            } else {
              setRouteValid(true);
            }
          }}
          errorMessage="Route must start with a forward slash (/)"
          state={routeValid ? "valid" : "error"}
          value={route}
          disabled={modalMode === "edit"}
        />

        <span style={{ margin: spacing[3] }}>
          <Combobox
            label="Populate from landing page"
            description="Select a landing page to pre-populate fields or leave empty to use a custom URL"
            placeholder="New page"
            onChange={handleLandingChange}
          >
            {landings.map(l => {
              return(
                <ComboboxOption value={l.identifier} displayName={`${l.identifier} - ${l.title}`} />
              )
            })}
          </Combobox>
        </span>

        <TextInput
          label="Destination"
          description="Enter a destination URL"
          placeholder="https://example.com"
          onChange={e => setTo(e.target.value)}
          value={to}
        />
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
        <Checkbox
          onChange={e => setIsPublic(!isPublic)}
          label="Is this item public?"
          checked={isPublic}
        />
      </ConfirmationModal>

      <Modal open={qrCodeModalOpened} setOpen={setQrCodeModalOpened} className={qrCodeModalStyle}>
        <H3>QR Code for {qrCodeDestination}</H3>
        <canvas ref={canvasRef} width="300"></canvas>
      </Modal>

      <Modal open={chartModalOpened} setOpen={setChartModalOpened} className={chartModalStyle}>
        <H3>Stats for {chartRoute}</H3>
        <Body>
          Number of visitors in the last 7 days: {routeStats?.stats?.visits || "0"}
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
            <Cell><Link href={datum.to} rel="noreferrer" target="_blank">{datum.to}</Link></Cell>
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