import { Outlet } from "react-router-dom";
import HeaderLink from "./HeaderLink";

export function Layout() {
  return (
    <div className="text-lg">
      <div className="bg-white fixed inset-x-0 top-0">
        <div className="bg-linen rounded-lg flex p-3 pl-6 m-4 gap-6 items-baseline text-lg font-sans font-semibold">
          <HeaderLink text="Уведомления" to="/"></HeaderLink>
          <HeaderLink text="События" to="/events"></HeaderLink>
        </div>
      </div>
      <div className="mt-22" />
      <Outlet />
    </div>
  );
}

export default Layout;
