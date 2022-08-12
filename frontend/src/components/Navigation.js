import { SideNav, SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { Link } from "react-router-dom";

export default function Navigation ({ className }) {
  return (
    <SideNav className={className}>
      <SideNavItem as={Link} active to="/">Home</SideNavItem>
      <SideNavItem as={Link} to="/page1">Page 1</SideNavItem>
      <SideNavGroup header="Other stuff" collapsible>
        <SideNavItem >
          Stuff 1
        </SideNavItem>
        <SideNavItem>
          Stuff 2
        </SideNavItem>
      </SideNavGroup>
    </SideNav>
  );
}