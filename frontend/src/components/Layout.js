import Header from "./Header";
import Navigation from "./Navigation";
import { css } from "@leafygreen-ui/emotion";import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from "../pages/Home";
import Page1 from "../pages/Page1";

const gridStyle = css`
  display: grid;
  grid-template:
    [header-start] "header header" 107px [header-end body-start]
    "side-nav body" auto [body-end] / auto 1fr;
  width: 100vw;
  max-width: 100%;
  height: 100vh;
  min-width: 767px;
  margin: 0px;
`;

const headerStyle = css`
  grid-area: header;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const sideNavStyle = css`
  grid-area: side-nav;
`;

const mainStyle = css`
  grid-area: body;
  padding: 12px;
`;

export default function Layout(props) {
  return(
    <Router>
      <div className={gridStyle}>
        <section className={headerStyle}>
          <Header title="My Demo App"/>
        </section>
        <Navigation className={sideNavStyle} />

        <section className={mainStyle}>
          <Routes>
            <Route path="/page1" element={<Page1 />} />
            <Route exact path="/" element={<Home />} />
          </Routes>
        </section>
      </div>
    </Router>
  )
}