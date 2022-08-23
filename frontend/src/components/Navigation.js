import { SideNav, SideNavItem } from '@leafygreen-ui/side-nav';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Navigation ({ className }) {
  const location = useLocation();

  return (
    <SideNav aria-label="Navigation Bar" className={className}>
      <SideNavItem aria-label="Home" as={Link} active={location.pathname === "/"} to="/">Home</SideNavItem>
      <SideNavItem aria-label="Short URLs" as={Link} active={location.pathname === "/app/routes"} to="/app/routes">Short URLs</SideNavItem>
      <SideNavItem aria-label="Dashboard" as={Link} active={location.pathname === "/app/stats"} to="/app/stats">Dashboard</SideNavItem>
    </SideNav>
  );
}