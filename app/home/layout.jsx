import Navbar from "@/components/Navbar/Navbar";

import { cookies } from "next/headers";

export default function ListingLayout({ children }) {
  const name = cookies().get("name").value;
  const photo = cookies().get("photo").value;
  return (
    <div>
      <Navbar userInfo={{ name, photo }} />
      <div className="tableParent flex flex-row gap-1">{children}</div>
    </div>
  );
}
