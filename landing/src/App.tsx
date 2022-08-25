import "./styles.css";
import "./fonts.css";
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';
import Landing from "./pages/Landing";

function App() {
  return (
    <LeafygreenProvider>
      <Landing />
    </LeafygreenProvider>
  );
}

export default App;