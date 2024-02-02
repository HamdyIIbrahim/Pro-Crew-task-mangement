"use client";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Image from "next/image";
import { FilterMatchMode } from "primereact/api";
import Link from "next/link";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  createTask,
  deleteTask,
  endTask,
  filterTasks,
  startTask,
} from "@/lib/features/Task/taskAction";
import { motion as m } from "framer-motion";
const Table = ({ tasks, getData }) => {
  const toast = useRef(null);
  const [allTasks, setAllTasks] = useState(tasks);
  const [visible, setVisible] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [progressTask, setProgressTask] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [, setClockIn] = useState(null);
  const [, setClockOut] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  async function handleClockIn(Id) {
    const dateNow = new Date();
    setClockIn(dateNow);
    setIsTracking(true);
    setProgressTask(Id);
    try {
      dispatch(startTask({ Id, clockIn: dateNow.toString() })).then(
        async (response) => {
          if (response.payload.status === 200) {
            setLoading(false);
            const newTasks = await getData();
            setAllTasks(newTasks);
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Task started.",
              life: 2000,
            });
          } else {
            setLoading(false);
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to start task.",
              life: 3000,
            });
          }
        }
      );
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error,
        life: 3000,
      });
    }
  }

  async function handleClockOut(Id) {
    setIsTracking(false);
    const dateNow = new Date();
    setProgressTask("");
    try {
      dispatch(endTask({ Id, clockOut: dateNow.toString() })).then(
        async (response) => {
          if (response.payload.status === 200) {
            setClockOut(dateNow);
            setLoading(false);
            const newTasks = await getData();
            setAllTasks(newTasks);
            setElapsedTime(0);
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Task Compeleted.",
              life: 2000,
            });
          } else {
            setLoading(false);
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to compelete task.",
              life: 3000,
            });
          }
        }
      );
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error,
        life: 3000,
      });
    }
  }

  useEffect(() => {
    let intervalId;
    const handleInterval = () => {
      setElapsedTime((prevTime) => prevTime + 1000);
    };

    if (isTracking) {
      intervalId = setInterval(handleInterval, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isTracking]);

  useEffect(() => {}, [allTasks, tasks, getData]);

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const formattedTime = `${hours.toString().padStart(2, "0")}:${(minutes % 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
    return formattedTime;
  }

  const getSeverity = (value) => {
    switch (value) {
      case "In progress":
        return "#6366F1";
      case "Completed":
        return "#22C55E";
      case "pending":
        return "#F59E0B";
      default:
        return null;
    }
  };

  async function handleDelete() {
    try {
      setLoading(true);
      dispatch(deleteTask(deleteId)).then(async (response) => {
        if (response.payload.status === 200) {
          setLoading(false);
          const newTasks = await getData();
          setAllTasks(newTasks);
          setVisible((prev) => !prev);
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Task deleted successfully.",
            life: 2000,
          });
        } else {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Faild to delete this task",
            life: 3000,
          });
        }
      });
    } catch (error) {
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    }
  }

  const footerContent = () => {
    return (
      <div>
        <Button
          label="No"
          onClick={() => setVisible(false)}
          className="bg-[--danger-color] text-white px-4 py-[2px] mr-2 rounded-lg"
        />
        {loading === true ? (
          <Button
            label={
              <ProgressSpinner
                style={{ width: "20px", height: "20px" }}
                strokeWidth="4"
                animationDuration=".5s"
              />
            }
            onClick={() => handleDelete()}
            autoFocus
            className="bg-[--main-color] text-white px-4 py-[2px] rounded-lg"
          />
        ) : (
          <Button
            label="Yes"
            onClick={() => handleDelete()}
            autoFocus
            className="bg-[--main-color] text-white px-4 py-[2px] rounded-lg"
          />
        )}
      </div>
    );
  };

  const actionsComponent = (option) => {
    return (
      <div className=" flex flex-row justify-center items-center gap-2 w-16">
        <Image
          alt={"image"}
          src={"/assets/edit.svg"}
          width={20}
          height={20}
          className="cursor-pointer"
        />
        <button
          label="Show"
          icon="pi pi-external-link"
          onClick={() => {
            setDeleteId(option._id);
            setVisible(true);
          }}
        >
          <Image
            alt={"image"}
            src={"/assets/delete.png"}
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </button>
        <div className="flex justify-center">
          <Dialog
            header="Delete Task"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
            footer={footerContent}
          >
            <p className="m-0">Are you sure you want to delete this Task ?</p>
          </Dialog>
        </div>
      </div>
    );
  };

  const getFilterTasks = () => {
    dispatch(filterTasks(globalFilterValue)).then((response) => {
      if (response.payload.status === 200) {
        console.log(response);
        setAllTasks(response.payload.data.task);
      }
    });
  };

  const startTaskTemplate = (option) => {
    return (
      <button
        onClick={() => handleClockIn(option._id)}
        disabled={progressTask !== "" ? true : false}
        className={` text-white px-4 py-[2px] rounded-lg ${
          progressTask !== "" ? "bg-[--secondry-color]" : "bg-[--main-color]"
        }`}
      >
        Start
      </button>
    );
  };

  const endTaskTemplate = (option) => {
    return (
      <button
        onClick={() => handleClockOut(option._id)}
        disabled={option._id !== progressTask ? true : false}
        className={`${
          option._id !== progressTask
            ? "bg-[--secondry-color]"
            : "bg-[--danger-color]"
        } text-white px-4 py-[2px] rounded-lg`}
      >
        End
      </button>
    );
  };

  const statusTemplate = (option) => {
    return (
      <Tag
        value={option.status}
        severity={getSeverity(option.status)}
        style={{ backgroundColor: getSeverity(option.status) }}
      />
    );
  };

  const handleError = (errors) => {};

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFormSubmit = async (data) => {
    try {
      setLoading(true);
      dispatch(createTask({ title: data.title })).then(async (response) => {
        if (response.payload.status === 201) {
          setLoading(false);
          const newTasks = await getData();
          setAllTasks(newTasks);
          setTaskModal((prev) => !prev);

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Task created successfully.",
            life: 2000,
          });
        } else {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to create task.",
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
  const timeSpentTemplate = (option) => {
    return <span>{formatTime(option.timeSpentOnTask)}</span>;
  };
  const registerOptions = {
    title: { required: "Task title is required" },
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between w-full my-4 lg:gap-2">
        <div className={`flex justify-content-end `}>
          <span
            className={`flex flex-row gap-2 bg-gray-200 text-gray-700 border rounded-lg border-gray-200 py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 w-full`}
          >
            <Image
              src="/assets/search.png"
              alt="search icon"
              width={20}
              height={10}
            />
            <input
              value={globalFilterValue}
              onChange={(e) => setGlobalFilterValue(e.target.value)}
              placeholder="Search by title"
              className={` bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:bg-transparent focus:border-gray-500 w-full mx-2`}
            />
          </span>
          <button
            onClick={getFilterTasks}
            className="bg-[#014e60] text-white px-4 py-[2px] w-52 lg:w-64  mx-2 rounded-lg"
          >
            Search
          </button>
          <button
            onClick={() => setTaskModal((prev) => !prev)}
            className="bg-[--main-color] text-white px-4 py-[2px] w-52 lg:w-64  mx-2 rounded-lg"
          >
            Add Task
          </button>
          <Dialog
            header="Add New Task"
            visible={taskModal}
            style={{ width: "50vw" }}
            onHide={() => setTaskModal(false)}
          >
            <form
              className="divide-y divide-gray-200"
              onSubmit={handleSubmit(onFormSubmit, handleError)}
            >
              <div className="py-8 text-base leading-6  text-gray-700 sm:text-lg sm:leading-7 text-center">
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="title"
                    name="title"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Title"
                    {...register("title", registerOptions.title)}
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors?.title && errors.title.message}
                  </p>
                  <label
                    htmlFor="title"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Title
                  </label>
                </div>
                <button
                  type="submit"
                  className="relative bg-[--main-color] text-white px-5 py-2 rounded-lg mt-10 w-24"
                >
                  {loading ? (
                    <ProgressSpinner
                      style={{ width: "20px", height: "20px" }}
                      strokeWidth="4"
                      animationDuration=".5s"
                    />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </Dialog>
        </div>
        <div className="text-2xl mr-10 text-center">
          <span className="text-[--main-color]">Tracker : </span>
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>
    );
  };

  const header = renderHeader();
  return (
    <m.div
      className="body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
    >
      <Toast ref={toast} />
      <DataTable
        value={allTasks}
        paginator
        rows={20}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
        className="mt-3"
        globalFilterFields={["title"]}
        header={header}
        headerstyle={{ backgroundColor: "white" }}
        filters={filters}
      >
        <Column
          field="title"
          header="Title"
          headerstyle={{ backgroundColor: "white" }}
        ></Column>
        <Column
          field="status"
          header="Status"
          body={statusTemplate}
          headerstyle={{ backgroundColor: "white" }}
        ></Column>
        <Column
          field="timeSpentOnTask"
          body={timeSpentTemplate}
          header="Time Spent"
          headerstyle={{ backgroundColor: "white" }}
        ></Column>
        <Column
          header="Start Task"
          body={startTaskTemplate}
          headerstyle={{ backgroundColor: "white" }}
        ></Column>
        <Column
          header="End Task"
          body={endTaskTemplate}
          headerstyle={{ backgroundColor: "white" }}
        ></Column>

        <Column
          field="Actions"
          header="ACTIONS"
          headerstyle={{ backgroundColor: "white" }}
          body={actionsComponent}
        ></Column>
      </DataTable>
    </m.div>
  );
};

export default Table;
