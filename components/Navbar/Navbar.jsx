"use client";
import Image from "next/image";
import style from "./Navbar.module.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "@/lib/features/User/authSlice";
import { useRouter } from "next/navigation";
const Navbar = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {}, []);
  async function handleLogOut() {
    try {
      await dispatch(logOut());
      router.push("/");
    } catch (error) {
      console.error("Error during logout process", error);
    }
  }
  return (
    <nav
      className={`${style.navBar} drop-shadow-md flex lg:flex-row justify-between items-center md:justify-between px-8 py-2 bg-white gap-5 min-h-[8vh]`}
    >
      <span className="font-extrabold text-2xl">
        <span className="text-[#019b98] ">ProCrew</span> TMS
      </span>
      <div className="flex flex-row gap-2 items-center">
        <div className={`${style.profileImage}`}>
          {userInfo.photo && (
            <Image
              src={decodeURIComponent(userInfo.photo) || "/assets/profile.png"}
              alt="profileImage"
              width={40}
              height={40}
            />
          )}
        </div>
        <div className="relative inline-block text-left">
          <button
            type="button"
            className="inline-flex justify-center items-center gap-2 w-full rounded-md px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{userInfo.name}</span>{" "}
            <Image
              src="/assets/Polygon.png"
              alt="drop icon"
              width={10}
              height={10}
            />
          </button>
          {isOpen && (
            <div className="dropDownNav absolute z-10 mt-2 w-28 rounded-md shadow-lg bg-white ">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  onClick={() => handleLogOut()}
                  className="w-full block px-4 py-2 font-semibold text-sm text-gray-700 hover:bg-gray-200 hover:text-black"
                  role="menuitem"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
