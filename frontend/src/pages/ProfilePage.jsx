import React from "react";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const user = useSelector((state) => state?.auth?.user);
  console.log(user);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--bg-color)]">
      <h1 className="text-center text-2xl text-[var(--text-color)]">
        Welcome{" "}
        <span className="text-[var(--accent-color)] font-semibold">
          {user.name}
        </span>
      </h1>
    </div>
  );
};

export default ProfilePage;
