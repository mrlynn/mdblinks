import React, { useState, useEffect } from "react";

export default function List () {
  let [landings, setLandings] = useState([]);
  
  useEffect(() => {
    const getLandings = async() => {
      let landings = await fetch("https://data.mongodb-api.com/app/landing-mgxlk/endpoint/getLandings").then(r => r.json());
      setLandings(landings);
    }
    getLandings();
  }, []);

  return(
    <React.Fragment>
      {landings.map(l => { return(
        <div>
          <a href={`https://landing.mdb.link/${l.identifier}`}>{l.title} - {l.subtitle}</a>
        </div>
      )})}
    </React.Fragment>
  )
}