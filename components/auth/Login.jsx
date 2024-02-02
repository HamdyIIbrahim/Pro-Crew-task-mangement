import { setCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authLogin } from "@/lib/features/User/authAction";
import { motion as m } from "framer-motion";
const Login = ({ setType }) => {
  const router = useRouter();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleError = (errors) => {};
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onFormSubmit = async (data) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };
    try {
      setLoading(true);
      dispatch(authLogin(loginData)).then((response) => {
        if (response.payload && response.payload.status === 201) {
          setLoading(false);
          setCookie("name", response.payload.data.name);
          setCookie("photo", response.payload.data.photo);
          setCookie("token", response.payload.data.token);
          router.push("/home");
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "login Successfully",
            life: 2000,
          });
        } else {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: response.payload.response.data.message,
            life: 3000,
          });
        }
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error,
        life: 3000,
      });
    }
  };
  const registerOptions = {
    email: { required: "Email is required" },
    password: { required: "Password is required" },
  };
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "anticipate" }}
      className="md:min-h-screen py-1 flex flex-col justify-center sm:py-4"
    >
      <Toast ref={toast} />
      <div className="relative py-3 sm:max-w-2xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#019b98] to-[#55ccc9] shadow-lg transhtmlForm -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-[white] shadow-lg sm:rounded-3xl sm:p-24">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold uppercase">
                Welcome to <span className="text-[#019b98]">ProCrew</span>
              </h1>
            </div>
            <form
              className="divide-y divide-gray-200"
              onSubmit={handleSubmit(onFormSubmit, handleError)}
            >
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Email address"
                    {...register("email", registerOptions.email)}
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors?.email && errors.email.message}
                  </p>
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    {...register("password", registerOptions.password)}
                    className="peer placeholder-transparent h-10 w-full mb-8 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Password"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors?.password && errors.password.message}
                  </p>
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  {loading === true ? (
                    <ProgressSpinner
                      style={{ width: "50px", height: "50px" }}
                      strokeWidth="4"
                      animationDuration=".5s"
                    />
                  ) : (
                    <>
                      <button
                        className="bg-[#019b98] text-white rounded-md w-full py-1"
                        type="submit"
                      >
                        Login
                      </button>
                      <h5 className="text-base text-center mt-1 text-[--secondry-color]">
                        Create a new account{" "}
                        <button
                          className="text-[#019b98]"
                          onClick={() => setType("signup")}
                        >
                          Sign Up
                        </button>
                      </h5>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default Login;
