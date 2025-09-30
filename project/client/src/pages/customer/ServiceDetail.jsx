import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Star, CheckCircle, Clock, Tag, User, ShieldCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Meta from "../../components/Meta";
import toast from "react-hot-toast";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/get/${id}`);
        setService(res.data);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/services/${id}/reviews`, reviewForm);
      setReviews([res.data, ...reviews]);
      setReviewForm({ name: "", rating: 5, comment: "" });
      toast.success("Bạn đã đánh giá !")
    } catch (err) {
      console.error("Error submit review:", err);
      alert("Không thể gửi đánh giá");
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-xl">Đang tải dịch vụ...</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Meta title={`Dịch vụ ${service?.name}`}/>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-teal-600 to-green-500 text-white py-28">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg animate-fadeIn">
            {service?.name}
          </h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto mb-6">
            {service?.description}
          </p>
          {avgRating && (
            <div className="flex items-center justify-center space-x-3 text-yellow-300 font-semibold">
              <Star className="fill-yellow-300" size={26} />
              <span className="text-2xl">{avgRating}/5</span>
              <span className="text-sm text-gray-200">({reviews.length} đánh giá)</span>
            </div>
          )}
          <Link
            to={`/booking/${service?._id}`}
            className="inline-flex items-center gap-3 mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 px-12 py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transform transition"
          >
            <CheckCircle size={24} /> Đặt ngay
          </Link>
        </div>
      </section>

      {/* Gallery */}
      {service?.images?.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-700">Hình ảnh dịch vụ</h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {service.images.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt={`Service ${i}`}
                  className="rounded-2xl shadow-lg w-full h-64 object-cover hover:scale-105 transform transition"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Highlights */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
            <Clock size={40} className="text-teal-600 mb-3" />
            <h4 className="font-semibold text-lg mb-1">Thời gian</h4>
            <p className="text-gray-500">{service?.duration || "1 giờ"}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
            <Tag size={40} className="text-teal-600 mb-3" />
            <h4 className="font-semibold text-lg mb-1">Phân loại</h4>
            <p className="text-gray-500">{service?.category || "Dịch vụ chung"}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
            <User size={40} className="text-teal-600 mb-3" />
            <h4 className="font-semibold text-lg mb-1">Đánh giá</h4>
            <p className="text-gray-500">{reviews.length} người dùng</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
            <ShieldCheck size={40} className="text-teal-600 mb-3" />
            <h4 className="font-semibold text-lg mb-1">Cam kết</h4>
            <p className="text-gray-500">Uy tín & chất lượng</p>
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-gray-50 rounded-xl border flex flex-col justify-center items-center hover:scale-105 transition">
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              <p className={`font-semibold text-lg ${service?.active ? "text-green-600" : "text-red-600"}`}>
                {service?.active ? "Đang cung cấp" : "Tạm ngưng"}
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border flex flex-col justify-center items-center hover:scale-105 transition">
              <p className="text-sm text-gray-500 mb-1">Giá dịch vụ</p>
              <p className="text-3xl font-bold text-teal-600">{service?.price?.toLocaleString()}đ</p>
            </div>
          </div>

          {/* Chi tiết dịch vụ */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-4">Chi tiết dịch vụ</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{service?.description || "Chưa có mô tả chi tiết."}</p>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="text-3xl font-bold mb-6">Đánh giá dịch vụ</h3>

            <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-2xl mb-10 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Tên của bạn"
                  value={reviewForm.name}
                  onChange={handleChange}
                  required
                  className="p-4 border rounded-xl w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <select
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleChange}
                  className="p-4 border rounded-xl w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} ★</option>
                  ))}
                </select>
              </div>
              <textarea
                name="comment"
                placeholder="Viết nhận xét..."
                value={reviewForm.comment}
                onChange={handleChange}
                required
                className="p-4 border rounded-xl w-full mb-4 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                rows={4}
              />
              <button type="submit" className="bg-teal-600 text-white px-10 py-3 rounded-xl shadow hover:bg-teal-700 transition font-semibold">
                Gửi đánh giá
              </button>
            </form>

            {reviews.length > 0 ? (
              <ul className="space-y-6">
                {reviews.map((r, i) => (
                  <li key={r._id || i} className="p-6 bg-white border rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700 text-lg">
                          {r.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-teal-700 text-lg">{r.name}</p>
                      </div>
                      <p className="text-yellow-500 font-medium text-lg">
                        {"★".repeat(r.rating)} <span className="text-gray-300">{"☆".repeat(5 - r.rating)}</span>
                      </p>
                    </div>
                    <p className="text-gray-700 text-lg">{r.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-lg">Chưa có đánh giá nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
