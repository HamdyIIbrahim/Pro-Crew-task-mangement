"use client";
import { motion as m } from "framer-motion";
import Image from "next/image";
import Login from "./Login";
import { useState } from "react";
import Signup from "./Signup";
const Auth = () => {
  const [type, setType] = useState("login");
  return (
    <m.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      className="md:h-screen flex flex-col md:flex-row justify-center md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0"
    >
      <div className="md:w-1/2 max-w-md">
        <Image
          src="/assets/loginImg.png"
          alt="Sample image"
          width={750}
          height={750}
        />
      </div>
      {type === "login" && <Login setType={setType} />}
      {type === "signup" && <Signup setType={setType} />}
    </m.section>
  );
};

export default Auth;
