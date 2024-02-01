import Table from "@/components/home/Table";
import { cookies } from "next/headers";
export const revalidate = 3600;
export async function getData() {
  "use server";
  const token = cookies().get("token").value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/tasks/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      cache: "no-store",
      revalidate,
    }
  );
  const result = await res.json();
  const tasks = result.tasks;
  return tasks;
}
const page = async () => {
  const allTasks = await getData();
  if (allTasks) {
    return <Table tasks={allTasks} getData={getData} />;
  }
};

export default page;
