import { Outlet, NavLink } from "react-router-dom";

export function Layout() {
  return (
    <div>
      <div className="bg-white fixed inset-x-0 top-0">
        <div className="bg-gray-200 rounded-sm flex p-3 m-4 gap-4 items-baseline">
          <NavLink className="uppercase hidden md:block" to="/">
            Notifications
          </NavLink>
          <NavLink className="uppercase hidden md:block" to="/events">
            Events
          </NavLink>
        </div>
      </div>
      <div className="mt-22" />
      <Outlet />
    </div>
  );
}

export default Layout;
