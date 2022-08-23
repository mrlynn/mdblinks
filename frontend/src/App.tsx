import "./styles.css";
import "./fonts.css";
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';
import Layout from "./components/Layout";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet
} from "react-router-dom";
import settings from "./config";

import Home from "./pages/Home";
import Shorties from "./pages/Shorties";
import Login from "./pages/Login";
import Stats from "./pages/Stats";

import { RealmProvider } from "./providers/Realm";

function PrivateOutlet() {
  let { isAuthenticated } = useAuth0();
  return isAuthenticated ? <Outlet /> : <div>You need to login to see this page</div>;
}

function App() {
  return (
    <Auth0Provider {...settings.AUTH0} >
      <RealmProvider appId={settings.REALM.appId}>
        <LeafygreenProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route path="app" element={<PrivateOutlet />}>
                  <Route path="routes" element={<Shorties />} />
                  <Route path="stats" element={<Stats />} />
                </Route>
                <Route path="/" element={<Home />} />
              </Route>
            </Routes>
          </Router>
        </LeafygreenProvider>
      </RealmProvider>
    </Auth0Provider>
  );
}

export default App;