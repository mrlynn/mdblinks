import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { Fragment, useEffect, useState } from "react";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import Button from "@leafygreen-ui/button";
import { css } from "@leafygreen-ui/emotion";

export default function Stats() {

  let [dashboard, setDashboard] = useState(null);
  let [filters, setFilters] = useState({utm_term: [], utm_medium: [], utm_source: [], utm_content: []});
  let [source, setSource] = useState(null);
  let [medium, setMedium] = useState(null);
  let [term, setTerm] = useState(null);
  let [content, setContent] = useState(null);

  const filterBar = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    button.apply {
      margin-left: 1rem;
      min-width: 10rem;
    }
  `;

  useEffect(() => {
    const loadChart = async () => {
      const sdk = new ChartsEmbedSDK({
        baseUrl: "https://charts.mongodb.com/charts-mdb-link-tcawx"
      });
      const d = await sdk.createDashboard( {
        dashboardId: "3ad73f20-2280-46e8-b555-0f45d6a8bfaf",
          height: "700px",
          widthMode: "scale"
      });
      setDashboard(d);
      d.render(document.getElementById("dashboard"));
    }
    const loadFilters = async () => {
      const response = await fetch('https://data.mongodb-api.com/app/admin-toxzg/endpoint/getFilters');
      const data = await response.json();
      setFilters(data);
    }
    loadChart();
    loadFilters();
  }, []);

  const handleNewFilter = () => {
    let filters = [];
    if (source) {
      filters.push({"routeDetails.utms.utm_source": source});
    }
    if (medium) {
      filters.push({"routeDetails.utms.utm_medium": medium});
    }
    if (term) {
      filters.push({"routeDetails.utms.utm_term": term});
    }
    if (content) {
      filters.push({"routeDetails.utms.utm_content": content});
    }
    let query = filters.length > 0 ? {"$and": filters} : {};
    dashboard.setFilter(query);
  }

  return(
    <Fragment>
      <div className={filterBar}>
        <Combobox
          label="Source"
          description="utm_source"
          onChange={value => setSource(value)}
          value={source}
        >
          {filters.utm_source.map(s => <ComboboxOption displayName={s} value={s} />)}
        </Combobox>
        <Combobox
          label="Medium"
          description="utm_medium"
          onChange={value => setMedium(value)}
          value={medium}
        >
          {filters.utm_medium.map(s => <ComboboxOption displayName={s} value={s} />)}
        </Combobox>
        <Combobox
          label="Term"
          description="utm_term"
          onChange={value => setTerm(value)}
          value={term}
        >
          {filters.utm_term.map(s => <ComboboxOption displayName={s} value={s} />)}
        </Combobox>
        <Combobox
          label="Content"
          description="utm_content"
          onChange={value => setContent(value)}
          value={content}
        >
          {filters.utm_content.map(s => <ComboboxOption displayName={s} value={s} />)}
        </Combobox>
        <Button className="apply" variant="primary" onClick={handleNewFilter}>Apply Filters</Button>
      </div>
      <div id="dashboard"></div>
    </Fragment>
  )
}