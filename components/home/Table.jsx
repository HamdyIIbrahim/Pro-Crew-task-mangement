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
import { createTask } from "@/lib/features/Task/taskAction";
const Table = ({ tasks, getData }) => {
  const toast = useRef(null);
  const [allTasks, setAllTasks] = useState(tasks);
  const [visible, setVisible] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  // const { token } = useSelector((state) => state.filter);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [clockIn, setClockIn] = useState(null);
  const [clockOut, setClockOut] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [interval, setInterval] = useState();
  const handleClockIn = () => {
    setClockIn(new Date());
  };

  const handleClockOut = () => {
    setClockOut(new Date());
    clearInterval(interval);
  };

  useEffect(() => {
    if (clockIn) {
      const id = setInterval(() => {
        const currentTime = new Date();
        const timeDiff = currentTime - clockIn;
        const hours = Math.floor(timeDiff / 3600000);
        const minutes = Math.floor((timeDiff % 3600000) / 60000);
        const seconds = Math.floor((timeDiff % 60000) / 1000);

        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      setInterval(id);
    }
  }, [clockIn, clockOut]);

  console.log(elapsedTime);

  useEffect(() => {}, [allTasks, tasks, getData]);

  function btnShowModal(Id) {
    setDeleteId(Id);
    setVisible(true);
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
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/delete-business/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setLoading(false);
        setVisible(false);
        const newData = await getData();
        setProducts(newData);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Business Deleted Successfully",
          life: 3000,
        });
      } else {
        setLoading(false);
        const data = await response.json();
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.message,
          life: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
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
          onClick={() => btnShowModal(option.id)}
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
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const startTaskTemplate = (option) => {
    return (
      <button
        onClick={handleClockIn}
        className="bg-[--main-color] text-white px-4 py-[2px] rounded-lg"
      >
        Start
      </button>
    );
  };
  const endTaskTemplate = () => {
    return (
      <button
        onClick={handleClockOut}
        className="bg-[--danger-color] text-white px-4 py-[2px] rounded-lg"
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
            detail: "login Successfully",
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
              onChange={onGlobalFilterChange}
              placeholder="Search by title"
              className={` bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:bg-transparent focus:border-gray-500 w-full mx-2`}
            />
          </span>
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
                  className="relative bg-[--main-color] text-white px-5 py-2 rounded-lg mt-10"
                >
                  Submit
                </button>
              </div>
            </form>
          </Dialog>
        </div>
        <div className="text-2xl mr-10 text-center">
          <span className="text-[--main-color]">Tracker : </span>
          <span>{elapsedTime}</span>
        </div>
      </div>
    );
  };
  const header = renderHeader();
  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={allTasks}
        paginator
        rows={5}
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
          header="Time Spent"
          headerstyle={{ backgroundColor: "white" }}
        ></Column>
        <Column
          header="Start"
          body={startTaskTemplate}
          headerstyle={{ backgroundColor: "white" }}
        ></Column>
        <Column
          header="End"
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
    </>
  );
};

export default Table;
