import React from "react";
import Header from "../components/Header";
import { useAuth0 } from "@auth0/auth0-react";
import { H3, Body } from "@leafygreen-ui/typography";
import Button from "@leafygreen-ui/button";
import { css } from "@leafygreen-ui/emotion";

export default function Login () {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect();
  }

  const headerStyle = css`
    grid-area: header;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  `

  const mainStyle = css`
    padding: 24px;
    align-items: center;
  `

  return  (
    <React.Fragment>
      <section className={headerStyle}>
        <Header title="Welcome!"></Header>
      </section>
      <section className={mainStyle}>
        <H3>Please login</H3>
        <Body>You can use the button below to open a session.</Body>

        <Button variant="primary" onClick={() => handleLogin()}>Log In</Button>

      </section>
    </React.Fragment>
  )
}