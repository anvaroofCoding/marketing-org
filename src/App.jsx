import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";
import { useGetAuthQuery } from "./services/api";
import { message } from "antd";
import { useEffect } from "react";

const App = () => {
  const location = useLocation();
  const { data, isLoading, error } = useGetAuthQuery();
  useEffect(() => {
    if (isLoading) {
      const lastShown = localStorage.getItem("token_check_success");
      const now = new Date();

      if (
        !lastShown ||
        new Date(lastShown).toDateString() !== now.toDateString()
      ) {
        message.success({
          content: "Token tekshiruvi!",
          duration: 5,
          closable: true,
        });
        localStorage.setItem("token_check_success", now.toISOString());
      }
    }
  }, [isLoading]);

  useEffect(() => {
    // ✅ ERROR har 10 soniyada tekshiriladi
    if (error) {
      const interval = setInterval(() => {
        message.error({
          content: "Profilingizdan chiqib qayta kiring iltimos",
          duration: 5,
          closable: true,
        });
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [error]);
  console.log(data);

  // boshidagi va oxiridagi / belgilardan tozalab olamiz
  const path = location.pathname.replace(/^\/|\/$/g, "");
  const segments = path.split("/");

  const segment = segments[0]; // "map"

  const tokens = localStorage.getItem("token_marketing");
  if (!tokens) {
    window.location.href = "/login";
  }
  return (
    <div className="flex roboto">
      <Sidebar />
      <div
        className={`relative w-full h-screen p-4 ${
          segment === "map" ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        {/* Background with pattern */}
        <div
          className="absolute inset-0 
               bg-[url('/naqsh1.jpg')] 
               bg-repeat 
               bg-center 
               bg-[length:100px_100px]  /* naqshni kichraytirish */
               opacity-15           /* naqshning shaffofligi */
               pointer-events-none" /* hover bosishga halal bermaydi */
        />

        {/* Content */}
        <div className="relative z-10 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
