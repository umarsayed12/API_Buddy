import {
  IconDashboard,
  IconHome,
  IconLogin,
  IconLogout,
  IconUser,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { HistoryIcon } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../slices/api/authApi";
import DarkModeToggle from "./ui/DarkModeToggle";

const Navbar = () => {
  const [logoutUser] = useLogoutUserMutation();
  const isAuth = useSelector((state) => state?.auth?.isAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    setMenuOpen(false);
  };

  const NavItems = [
    { title: "Home", show: true, icon: <IconHome />, link: "/" },
    {
      title: "Dashboard",
      show: isAuth,
      icon: <IconDashboard />,
      link: "/dashboard",
    },
    {
      title: "History",
      show: isAuth,
      icon: <HistoryIcon />,
      link: "/test-history",
    },
    { title: "Profile", show: isAuth, icon: <IconUser />, link: "/profile" },
    { title: "Login", show: !isAuth, icon: <IconLogin />, link: "/login" },
    { title: "Signup", show: !isAuth, icon: <IconUser />, link: "/signup" },
  ];

  const handleNavigate = (link) => {
    navigate(link);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed z-50 w-full bg-[var(--nav-bg)] text-[var(--text-color)] shadow-md px-4 sm:px-6 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="w-[50%] sm:w-[15%] font-bold text-xl sm:text-2xl">
          {localStorage.getItem("theme") == "dark" ? (
            "API Buddy"
          ) : (
            <img src="/public/LogoLight.png" width="95%"></img>
          )}
        </div>
        <div className="w-[80%] sm:hidden flex justify-end items-center pr-2">
          <DarkModeToggle />
        </div>
        <ul className="hidden sm:flex flex-wrap gap-4 items-center">
          <>
            <DarkModeToggle />
          </>
          {NavItems.map(
            (item) =>
              item.show && (
                <li key={item.title}>
                  <button
                    onClick={() => navigate(item.link)}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-[var(--text-color)] hover:bg-[var(--nav-hover)] hover:text-[var(--input-bg)]"
                  >
                    {item.icon}
                    <span className="hidden lg:inline">{item.title}</span>
                  </button>
                </li>
              )
          )}
          {isAuth && (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full transition-all duration-200 text-[var(--text-color)] hover:bg-[var(--nav-hover)] hover:text-white"
              >
                <IconLogout />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden cursor-pointer text-[var(--text-color)] hover:text-[var(--accent-color)]"
        >
          {menuOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
        </button>
      </div>

      {menuOpen && (
        <ul className="sm:hidden flex flex-col gap-2 px-4 pt-3 pb-4 bg-[var(--bg-color)] text-[var(--text-color)] shadow-md rounded-md mt-2">
          {NavItems.map(
            (item) =>
              item.show && (
                <li key={item.title}>
                  <button
                    onClick={() => handleNavigate(item.link)}
                    className="w-full cursor-pointer text-left flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 hover:bg-[var(--nav-hover)] hover:text-white"
                  >
                    {item.icon}
                    {item.title}
                  </button>
                </li>
              )
          )}
          {isAuth && (
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 hover:bg-[var(--nav-hover)] hover:text-white"
              >
                <IconLogout />
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
