import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { Fragment, useEffect } from "react";

export default function Stats() {

  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: "https://charts.mongodb.com/charts-mdb-link-tcawx"
    });
    const dashboard = sdk.createDashboard( {
      dashboardId: "6304b9d7-df9a-46e5-8fc2-687fa31be646",
        height: "700px",
        widthMode: "scale",
        heightMode: "fixed"
    });
    dashboard.render(document.getElementById("dashboard"));  
  }, []);

  return(
    <Fragment>
      <div id="dashboard"></div>
    </Fragment>
  )
}