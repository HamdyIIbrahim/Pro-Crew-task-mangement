import { setCookie } from "cookies-next";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authSignup } from "@/lib/features/User/authAction";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { motion as m } from "framer-motion";
const Signup = ({ setType }) => {
  const [selectedFiles, setSelectedFiles] = useState("");
  const [profileImage, setProfileImage] = useState();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm({ defaultValues });

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };
  const passwordFooter = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );
  const validateConfirmPassword = (value) => {
    const password = getValues("password");
    return password === value || "Passwords do not match ";
  };
  const onFormSubmit = async (data) => {
    const signupData = {
      name: data.name,
      email: data.email,
      password: data.password,
      photo: profileImage,
    };
    try {
      setLoading(true);
      dispatch(authSignup(signupData)).then((response) => {
        if (response.payload.status === 201) {
          setLoading(false);
          setType("login");
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: response.payload.data.message,
            life: 2000,
          });
        } else {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: response.payload.message,
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
  const handleChange = (e) => {
    const file = e.currentTarget.files[0];
    setProfileImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedFiles(reader.result);
    };
  };
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "anticipate" }}
      className="md:min-h-screen py-1 flex flex-col justify-center sm:py-12"
    >
      <Toast ref={toast} />
      <div className="relative py-1 sm:max-w-2xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#019b98] to-[#55ccc9]  shadow-lg transhtmlForm -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:pt-8 sm:pb-3 sm:px-24">
          <div className="max-w-md mx-auto">
            <div className="mb-3">
              <h1 className="text-2xl font-semibold uppercase">
                Welcome to <span className="text-[#019b98]">ProCrew</span>
              </h1>
            </div>
            <div
              className={`h-full w-full m-auto flex justify-center items-center flex-col rounded-lg `}
            >
              <div className={`size-[100px] rounded-full overflow-hidden`}>
                <Image
                  src={`${
                    selectedFiles.length === 0
                      ? "/assets/profileImage.png"
                      : selectedFiles
                  }`}
                  alt={"profile image"}
                  width={200}
                  height={200}
                />
              </div>
              <form
                className={`w-full w-100 h-full`}
                onSubmit={handleSubmit(onFormSubmit)}
              >
                <div className={`w-full w-100 mb-6 h-full`}>
                  <div className="">
                    <label
                      className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Name
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Name is required." }}
                      render={({ field }) => (
                        <span className="mb-2">
                          <input
                            className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                              errors.name ? "border-red-500" : "border-gray-200"
                            } rounded py-1 px-4 mb-2 leading-tight focus:outline-none focus:bg-white`}
                            id={field.name}
                            {...field}
                            type="text"
                            placeholder="hamdy"
                          />
                          {getFormErrorMessage("name")}
                        </span>
                      )}
                    />
                  </div>
                  <div className="">
                    <label
                      className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Email
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "Email is required.",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message:
                            "Invalid email address. E.g. example@email.com",
                        },
                      }}
                      render={({ field }) => (
                        <span className="mb-4">
                          <input
                            className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                              errors.name ? "border-red-500" : "border-gray-200"
                            } rounded py-1 px-4 mb-2 leading-tight focus:outline-none focus:bg-white`}
                            type="text"
                            placeholder="hamdy@procrew.com"
                            id={field.name}
                            {...field}
                          />
                          {getFormErrorMessage("email")}
                        </span>
                      )}
                    />
                  </div>
                  <div className="">
                    <label
                      className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Password
                    </label>
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: "Password is required." }}
                      render={({ field }) => (
                        <span className="mb-2">
                          <Password
                            id={field.name}
                            {...field}
                            toggleMask
                            className={` appearance-none block w-full bg-gray-200 text-gray-700 border ${
                              errors.password
                                ? "border-red-500"
                                : "border-gray-200"
                            } rounded  mb-2 leading-tight focus:outline-none focus:bg-white`}
                            footer={passwordFooter}
                          />
                          {getFormErrorMessage("password")}
                        </span>
                      )}
                    />
                  </div>
                  <div className="">
                    <label
                      className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Confirm Password
                    </label>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      rules={{
                        required: "confirmPassword is required.",
                        validate: validateConfirmPassword,
                      }}
                      render={({ field }) => (
                        <span className="mb-2">
                          <Password
                            id={field.name}
                            {...field}
                            toggleMask
                            className={` appearance-none block w-full bg-gray-200 text-gray-700 border ${
                              errors.confirmPassword
                                ? "border-red-500"
                                : "border-gray-200"
                            } rounded  mb-2 leading-tight focus:outline-none focus:bg-white`}
                            footer={passwordFooter}
                          />
                          {getFormErrorMessage("confirmPassword")}
                        </span>
                      )}
                    />
                  </div>
                  <div className="">
                    <label
                      className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Profile Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center mb-2 justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-100 dark:bg-gray-100 hover:bg-gray-200 dark:border-gray-100 dark:hover:border-gray-200 dark:hover:bg-gray-200"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-700 dark:text-gray-700"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-700 dark:text-gray-700">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={handleChange}
                        />
                      </label>
                    </div>
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
                          Submit
                        </button>
                        <h5 className="text-base text-center mt-1 text-[--secondry-color]">
                          Already have account{" "}
                          <button
                            className="text-[#019b98]"
                            onClick={() => setType("login")}
                          >
                            Login
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
      </div>
    </m.div>
  );
};

export default Signup;
