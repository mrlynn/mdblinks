import { createContext, useContext, useState, useEffect } from "react";
import * as Realm from "realm-web";
import { useAuth0 } from "@auth0/auth0-react";

function RealmProvider(props) {
  let [realmUser, setRealmUser] = useState(null);
  let appId = props.appId;
  let { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function loginCustomJwt() {
      let app = new Realm.App({ id: appId });
      let jwt = await getAccessTokenSilently({
        audience: 'mdb-atlas'
      });
      const credentials = Realm.Credentials.jwt(jwt);
      try {
        const user = await app.logIn(credentials);
        setRealmUser(user);
        return user;
      } catch (err) {
        console.error("Failed to log in", err);
      }
    }
    loginCustomJwt();
  }, [isAuthenticated, getAccessTokenSilently, appId])

  let providerState = {
    realmUser
  }

  return (
    <RealmContext.Provider value={providerState}>
      {props.children}
    </RealmContext.Provider>
  );
}

const RealmContext = createContext({ realmUser: null });
const useRealm = () => useContext(RealmContext);

export {
  RealmContext,
  useRealm,
  RealmProvider
}
