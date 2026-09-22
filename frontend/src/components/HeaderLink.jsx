import { NavLink } from "react-router-dom";
export default function HeaderLink({ text, to }) {
  return (
    <NavLink className="uppercase hidden md:block hover:underline" to={to}>
      {text}
    </NavLink>
  );
}
