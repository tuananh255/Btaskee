import React from "react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Dọn nhà theo giờ",
    desc: "Nhanh chóng, tiện lợi, nhân viên chuyên nghiệp.",
    icon: "🧹",
    href: "/dich-vu/don-nha-theo-gio"
  },
  {
    title: "Dọn văn phòng",
    desc: "Vệ sinh sạch sẽ, đảm bảo môi trường làm việc an toàn.",
    icon: "🏢",
    href: "/dich-vu/don-van-phong"
  },
  {
    title: "Vệ sinh định kỳ",
    desc: "Dọn dẹp hàng tuần/tháng theo yêu cầu.",
    icon: "🧼",
    href: "/dich-vu/ve-sinh-dinh-ky"
  },
  {
    title: "Dịch vụ khác",
    desc: "Các dịch vụ vệ sinh khác theo yêu cầu.",
    icon: "✨",
    href: "/dich-vu/khac"
  }
];

const stats = [
  { title: "Đơn đang chờ", value: 3 },
  { title: "Đơn đã hoàn thành", value: 12 },
  { title: "Voucher khả dụng", value: 2 }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero / Banner */}
      <div className="bg-[#ff8228] text-white py-16 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Chào mừng bạn đến với Btaskee</h1>
        <p className="max-w-2xl text-lg md:text-xl">
          Dịch vụ dọn nhà, vệ sinh văn phòng chuyên nghiệp, nhanh chóng và tiện lợi.
        </p>
      </div>

      {/* Thống kê / Quick Stats */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
            <p className="text-3xl font-bold text-[#ff8228]">{stat.value}</p>
            <p className="text-gray-600 mt-2">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Dịch vụ chính */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Dịch vụ của chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <Link
              key={idx}
              to={service.href}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Banner quảng cáo / Call to action */}
      <div className="bg-[#ff8228] text-white py-12 mt-12 text-center px-4 rounded-lg mx-4 md:mx-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Đặt dịch vụ ngay hôm nay!</h2>
        <p className="mb-6">Nhanh chóng, tiện lợi và an toàn với Btaskee.</p>
        <Link
          to="/dat-dich-vu"
          className="bg-white text-[#ff8228] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Đặt dịch vụ
        </Link>
      </div>

      {/* Footer placeholder */}
      <div className="mt-16"></div>
    </div>
  );
}
