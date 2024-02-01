"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "Login",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
