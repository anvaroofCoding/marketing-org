import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetDelaysQuery,
  useGetMeQuery,
  useGetNotiveQuery,
} from "@/services/api";
import { Modal, Spin } from "antd";
import {
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  LogOut,
  Map,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(["/delays/"]);
  const [collapsed, setCollapsed] = useState(false); // 🔥 sidebar collapse state
  const { data: notiveData, isLoading: Endloading } = useGetNotiveQuery();

  const { data: userData, isLoading } = useGetMeQuery();
  const { data: deleyEnd, isLoading: delaysEndLoading } = useGetDelaysQuery();

  if (isLoading || Endloading || delaysEndLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-85 ">
        <Spin />
      </div>
    );
  }

  const menuItems = [
    {
      key: "/",
      icon: <Home size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Bosh sahifa</span>
        </div>
      ),
    },
    {
      key: "/map/",
      icon: <Map size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Xarita</span>
          <Badge
            variant="secondary"
            className="bg-yellow-500 text-white hover:bg-yellow-700 ml-2"
          >
            {notiveData?.stations}
          </Badge>
        </div>
      ),
    },
    {
      key: "/archive/",
      icon: <Archive size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Arxiv</span>
          <Badge
            variant="secondary"
            className="bg-blue-700 text-white hover:bg-green-900 ml-2"
          >
            {notiveData?.advertisement_archives}
          </Badge>
        </div>
      ),
    },
    {
      key: "/umumiy-qidiruv/",
      icon: <Search size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Umumiy reklamalar</span>
          <Badge
            variant="secondary"
            className="bg-purple-700 text-white hover:bg-purple-900 ml-2"
          >
            {notiveData?.advertisements}
          </Badge>
        </div>
      ),
    },
    {
      key: "/delays/",
      icon: <Clock size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Shartnomalar muddati</span>
          <Badge
            variant="secondary"
            className="bg-green-600 text-white hover:bg-green-900 ml-2"
          >
            {deleyEnd?.counts.haftada_tugaydigan + deleyEnd?.counts.tugagan}
          </Badge>
        </div>
      ),
      children: [
        {
          key: "/delay7/",
          label: (
            <div className="flex justify-between items-center w-full">
              <span>Oxirgi hafta</span>
              <Badge
                variant="secondary"
                className="bg-orange-500 text-white hover:bg-orange-600 ml-2"
              >
                {deleyEnd?.counts.haftada_tugaydigan}
              </Badge>
            </div>
          ),
        },
        {
          key: "/delaysEnd/",
          label: (
            <div className="flex justify-between items-center w-full">
              <span>Tugaganlar</span>
              <Badge
                variant="secondary"
                className="bg-red-500 text-white hover:bg-red-600 ml-2"
              >
                {deleyEnd?.counts.tugagan}
              </Badge>
            </div>
          ),
        },
      ],
    },
  ];

  const toggleExpanded = (key) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleNavigation = (key) => {
    navigate(key);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Chiqishni tasdiqlang",
      content: "Rostan ham tizimdan chiqmoqchimisiz?",
      okText: "Ha, chiqaman",
      cancelText: "Bekor qilish",
      okType: "danger",
      centered: true,
      onOk: () => {
        localStorage.removeItem("token_marketing");
        window.location.href = "/login"; // agar boshqa sahifaga o‘tkazish kerak bo‘lsa
      },
    });
  };

  const renderMenuItem = (item, level = 0) => {
    const isActive = location.pathname === item.key;
    const isExpanded = expandedItems.includes(item.key);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.key} className="w-full">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.key);
            } else {
              handleNavigation(item.key);
            }
          }}
          className={`
            w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 rounded-lg mx-2 mb-1
            ${level > 0 ? "ml-6 pl-8" : ""}
            ${
              isActive
                ? "bg-gradient-to-r bg-white text-black shadow-lg "
                : "text-white  hover:bg-blue-600 hover:text-white"
            }
          `}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <span className={isActive ? "text-black" : "text-white"}>
                {item.icon}
              </span>
            )}
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </div>
          {hasChildren && !collapsed && (
            <span className="text-gray-400">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          )}
        </button>

        {hasChildren && isExpanded && !collapsed && (
          <div className="ml-4">
            {item.children?.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`h-screen  bg-[#1777FF] border-r border-gray-800 flex flex-col transition-all  duration-300 ${
        collapsed ? "w-20" : "w-85"
      }`}
    >
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <img src="/logos.png" alt="metro logo" className="w-10" />
            <h1 className="text-2xl font-bold text-white">Marketing</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white p-2 rounded-full hover:bg-black transition"
        >
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* Account Section */}
      {!collapsed && (
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-white">
            <div className="w-10 h-10 bg-gradient-to-r bg-black rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">
                {userData?.username}
              </p>
            </div>
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start bg-red-600 text-gray-300 hover:text-white hover:bg-red-800 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
