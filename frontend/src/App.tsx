import "./styles.css";
import "./fonts.css";
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';
import Layout from "./components/Layout";

function App() {
  return (
    <LeafygreenProvider>
      <Layout>
        Hello World
      </Layout>
    </LeafygreenProvider>
  );
}

export default App;