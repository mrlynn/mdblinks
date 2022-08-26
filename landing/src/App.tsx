import "./styles.css";
import "./fonts.css";
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';
import Landing from "./pages/Landing";
import List from "./pages/List";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <LeafygreenProvider>
      <Router>
        <Routes>
          <Route path="/:identifier" element={<Landing />} />
          <Route path="/" element={<List />} />
        </Routes>
      </Router>
    </LeafygreenProvider>
  );
}

export default App;