import React from "react";
import {Link} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Home () {
  let { isAuthenticated } = useAuth0();
  return  (
    <React.Fragment>
      Welcome to <a href="http://mdb.link">mdb.link</a> admin UI.<br/><br/>
      {!isAuthenticated &&
        <Link to="/login">Login</Link>
      }
    </React.Fragment>
  )
}