import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Sparkles } from "lucide-react"; // icon đẹp

export default function Service() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services/getall");
        setServices(res.data);
      } catch (err) {
        console.error("Lỗi khi tải dịch vụ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-gray-600 animate-pulse">Đang tải dịch vụ...</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-teal-600 to-emerald-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Dịch vụ vệ sinh chuyên nghiệp
          </h1>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Tiết kiệm thời gian – Tận hưởng không gian sạch sẽ & tiện nghi cùng đội ngũ chuyên nghiệp.
          </p>
          <Link
            to="/contact"
            className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>

      {/* Danh sách dịch vụ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Dịch vụ của chúng tôi
          </h2>

          {services.length === 0 ? (
            <p className="text-center text-gray-600">Hiện chưa có dịch vụ nào.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link
                  key={service._id}
                  to={`/service/${service._id}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 p-8 flex flex-col items-center text-center border border-transparent hover:border-teal-500"
                >
                  <div className="bg-teal-100 text-teal-600 p-4 rounded-full mb-6 group-hover:bg-teal-600 group-hover:text-white transition">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-teal-600 transition">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <p className="font-bold text-teal-600 text-lg">
                    {service.price.toLocaleString()}đ
                  </p>
                  <span className="mt-6 inline-block bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow hover:bg-teal-700 transition">
                    Đặt ngay
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
