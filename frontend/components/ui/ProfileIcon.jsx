import { useState, useRef, useEffect } from "react";
import { User, Book, LogOut, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  useLoginUserMutation,
  useLogoutUserMutation,
} from "@/slices/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { IconDashboard } from "@tabler/icons-react";

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [logoutUser, { data: logoutData, isSuccess, error, isError }] =
    useLogoutUserMutation();
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      toast.success(logoutData.message || "User Logged Out.");
      navigate("/login");
    } else if (isError) {
      toast.error(error.message || "Some Error Occured. Try Again.");
    }
  }, [logoutData, isSuccess, isError]);

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-full focus:outline-none focus:ring-custom-orange"
      >
        {user.isAuthenticated && user.user.imageUrl ? (
          <div className="w-6 h-6 overflow-hidden rounded-full">
            <img
              src={user?.user?.imageUrl}
              alt="Profile Photo"
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <UserCircle className="w-6 h-6 text-black dark:text-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50">
          <div className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-100 border-b dark:border-gray-700">
            My Account
          </div>
          <ul className="py-1 text-gray-800 dark:text-gray-100">
            <Link to="/profile" className="">
              <li
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </li>
            </Link>
            {user.user.role === "student" ? (
              <Link to="/my-learnings" className="">
                <li
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2"
                >
                  <Book className="w-4 h-4" />
                  My Learnings
                </li>
              </Link>
            ) : (
              <Link to="admin/dashboard" className="">
                <li
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer gap-2"
                >
                  <IconDashboard className="w-4 h-4" />
                  Dashboard
                </li>
              </Link>
            )}
          </ul>
          <div className="border-t dark:border-gray-700 px-4 py-2">
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-600/10 cursor-pointer rounded py-1"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
