import { Link, useLocation } from "react-router-dom";
import React from "react";

function MenuItem (
  { menu }: { menu: any }
) {
  const IconComp = menu.icon;
  const location = useLocation();
  const [hovering, setHovering] = React.useState(false);

  const highlight = (
    hovering
    ||
    location.pathname === menu.url
  );

  return (
    <Link
      key={menu.url}
      to={menu.url}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
      className={highlight ? 'active' : undefined}
    >
      <IconComp active={highlight} />
      <label>{menu.name}</label>
    </Link>
  );
}

export default MenuItem;