"use client";

import {
  useGetStatistikcPhotosQuery,
  useGetStatistikcQuery,
} from "../services/api";
import { Carousel, Col, Image, Rate, Row, Spin, Statistic } from "antd";
import {
  TrendingUpIcon,
  UsersIcon,
  DollarSignIcon,
  BarChart3Icon,
  PlayCircleIcon,
  StarIcon,
  MapPinIcon,
  EyeIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";
import CountUp from "react-countup";

const Dashboard = () => {
  const { data: StatistikData, isLoading } = useGetStatistikcQuery();
  const { data: statistikPhotosData, isLoading: statistikLoading } =
    useGetStatistikcPhotosQuery();
  const carouselRef = useRef(null);

  const getStatIcon = (index) => {
    const icons = [
      <TrendingUpIcon key="icon1" className="w-5 h-5" />,
      <UsersIcon key="icon2" className="w-5 h-5" />,
      <DollarSignIcon key="icon3" className="w-5 h-5" />,
      <BarChart3Icon key="icon4" className="w-5 h-5" />,
    ];
    return icons[index % icons.length];
  };

  const getStatColor = (index) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-purple-500 to-purple-600",
    ];
    return colors[index % colors.length];
  };

  if (isLoading || statistikLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spin size="large" />
      </div>
    );
  }

  const formatter = (value) => <CountUp end={value} separator="," />;

  return (
    <div className="min-h-screen  overflow-y-auto">
      <div className="bg-blue-600 rounded-lg border-b border-gray-100 p-4 mb-6 bg-gradient-to-br bg-from-blue-800 to-blue-600">
        <h1 className="font-semibold text-2xl text-white">
          Reklamalar statistikasi
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Hozirgi vaqtdagi reklama statistikasi
        </p>
      </div>

      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {StatistikData?.counts?.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-all duration-200 flex justify-between items-center bg-gradient-to-br ${getStatColor(
                index
              )}/90`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${getStatColor(
                    index
                  )} text-white`}
                >
                  {getStatIcon(index)}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xl font-semibold text-gray-900 tabular-nums">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        // title={item.color}
                        className="font-bold"
                        value={item.value}
                        formatter={formatter}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="text-xs text-gray-600 font-bold capitalize">
                  {item.color || "Metric"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Performing Ads - Compact */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <StarIcon className="w-5 h-5 text-yellow-500 mr-2" />
            Top reklamalar
          </h2>
          <div className="space-y-3">
            {StatistikData?.top_5_ads?.map((items) => {
              // summani raqamga aylantiramiz
              const summa = Number(items.Shartnoma_summasi);

              // summa bo‘yicha yulduzcha sonini aniqlash
              const getStarsBySumma = (sum) => {
                if (sum < 10000000) return 1;
                if (sum < 20000000) return 2;
                if (sum < 30000000) return 3;
                if (sum < 40000000) return 4;
                return 5;
              };

              return (
                <div
                  key={items.id}
                  className="bg-white border-blue-500/20 rounded-xl p-3 border hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between space-x-3">
                    {/* Chap tomoni: rasm + nom + summa */}
                    <div className="flex items-center space-x-3">
                      <Image
                        src={items.photo || "/placeholder.svg"}
                        width={50}
                        height={50}
                        alt={items.Reklama_nomi}
                        className="rounded-lg object-cover"
                        preview={{
                          mask: <EyeIcon className="w-4 h-4" />,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {items.Reklama_nomi}
                        </h3>
                        <p className="text-xs text-green-600 font-medium">
                          {summa.toLocaleString("uz-UZ")} Som
                        </p>
                      </div>
                    </div>

                    {/* O‘ng tomoni: ⭐ Rate summaga qarab */}
                    <Rate value={getStarsBySumma(summa)} disabled />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <PlayCircleIcon className="w-5 h-5 text-blue-500 mr-2" />
            Top 10ta reklama fotosuratlari
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden relative">
            <Carousel
              ref={carouselRef}
              autoplay={{ delay: 3000 }}
              autoplaySpeed={3000}
              dots={false}
              effect="fade"
            >
              {statistikPhotosData?.map((items) => (
                <div key={items.id}>
                  <div className="aspect-video relative">
                    <img
                      src={items.photo || "/placeholder.svg"}
                      alt={items.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent rounded-xl" />
                    <div className="absolute bottom-5 left-5 text-white">
                      <h3 className="text-5xl font-medium">{items.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>

            {/* Tugmalar */}
            <button
              onClick={() => carouselRef.current?.prev()}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => carouselRef.current?.next()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
              type="button"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <MapPinIcon className="w-5 h-5 text-green-500 mr-2" />
          Top stansiyalar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {StatistikData?.top_5_stations?.map((items) => (
            <div
              key={items.id}
              className=" rounded-2xl p-5 border border-blue-400 shadow-sm hover:shadow-md transition-all duration-300 bg-blue-500/30"
            >
              <div className="flex items-center justify-between">
                {/* Chap tomoni */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-blue-600 text-xl truncate">
                    {items.position__station__name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    {/* Reklama soni (haybatli badge) */}
                    <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-md">
                      {items.total} ta reklama
                    </span>
                  </div>
                </div>

                {/* O‘ng tomoni: joylashuv ikonkasi */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white ml-4 shadow">
                  <MapPinIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
