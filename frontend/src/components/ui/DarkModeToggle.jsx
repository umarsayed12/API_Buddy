import React, { useEffect, useState } from "react";
import { Moon, MoonIcon, Sun, SunIcon } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full sm:bg-[var(--bg-color)] p-2 cursor-pointer transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <SunIcon fill="yellow" className="h-5 w-5 text-yellow-200" />
      ) : (
        <MoonIcon fill="white" className="h-5 w-5" />
      )}
    </button>
  );
}
