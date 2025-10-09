import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Meta from "../../components/Meta";
import { MapPin, Calendar, Clock, FileText, CreditCard, CheckCircle2 } from "lucide-react";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [service, setService] = useState(null);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch: "",
    date: "",
    time: "",
    notes: "",
    paymentMethod: "COD",
  });

  // Fetch service
  useEffect(() => {
    axios.get(`http://localhost:5000/api/services/get/${id}`)
      .then(res => setService(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Fetch branches
  useEffect(() => {
    axios.get("http://localhost:5000/api/branches/getall")
      .then(res => setBranches(res.data))
      .catch(err => console.error("Fetch branches failed:", err));
  }, []);

  // Sync Clerk user
  useEffect(() => {
    if (user) {
      axios.post("http://localhost:5000/api/auth/sync", {
        clerkId: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        phone: user.primaryPhoneNumber?.phoneNumber,
      }).then(res => {
        localStorage.setItem("customerId", res.data.customer.clerkId);
      }).catch(err => console.error("Sync customer failed:", err));
    }
  }, [user]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return toast.error("Vui lòng đăng nhập trước khi đặt dịch vụ!");

    const customerId = localStorage.getItem("customerId");
    if (!customerId) return toast.error("Không tìm thấy thông tin khách hàng!");

    if (!formData.branch) return toast.error("Vui lòng chọn chi nhánh!");

    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}`);
      if (formData.paymentMethod === "COD") {
        await axios.post("http://localhost:5000/api/orders", {
          customer: customerId,
          service: id,
          branch: formData.branch,
          scheduledAt,
          notes: formData.notes,
          price: service.price,
          paymentStatus: "unpaid",
          paymentMethod: "COD",
        });
        toast.success("Đặt dịch vụ thành công!");
        navigate("/orders-susscess");
      } else {
        const res = await axios.post("http://localhost:5000/api/momo/create", {
          amount: service.price,
          orderInfo: `Thanh toán dịch vụ: ${service.name}`,
          customer: customerId,
          branch: formData.branch,
          products: [{ serviceId: id, name: service.name, price: service.price }],
          paymentMethod: "Thanh toán Momo",
        });
        if (res.data.payUrl) window.location.href = res.data.payUrl;
        else toast.error("Không tạo được giao dịch MoMo!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi đặt dịch vụ!");
    }
  };

  if (!service)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500 animate-pulse">
        Đang tải dịch vụ...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 font-sans">
      <Meta title={`Đặt dịch vụ ${service.name}`} />

      {/* Hero Banner */}
      <section className="text-center py-20 bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Đặt dịch vụ: {service.name}
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          {service.description || "Giải pháp vệ sinh chuyên nghiệp, nhanh chóng & tận tâm."}
        </p>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Booking form */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-teal-100 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="text-teal-600" /> Thông tin đặt dịch vụ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Branch */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <MapPin className="text-teal-600" size={18} /> Chọn chi nhánh
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} - {b.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Calendar className="text-teal-600" size={18} /> Ngày
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Clock className="text-teal-600" size={18} /> Giờ
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <FileText className="text-teal-600" size={18} /> Ghi chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Ví dụ: Yêu cầu nhân viên mang theo máy hút bụi..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Payment */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <CreditCard className="text-teal-600" size={18} /> Phương thức thanh toán
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="COD">Thanh toán khi hoàn thành (COD)</option>
                <option value="Thanh toán Momo">Thanh toán qua MoMo</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition duration-300"
            >
              Xác nhận đặt dịch vụ
            </button>
          </form>
        </div>

        {/* Service summary */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100 hover:shadow-2xl transition">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Thông tin dịch vụ</h3>
          <p className="text-gray-700 font-medium mb-2">{service.name}</p>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {service.description || "Dịch vụ hiện chưa có mô tả chi tiết."}
          </p>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500">Giá:</span>
            <span className="text-teal-600 font-bold text-xl">
              {service.price.toLocaleString()}đ
            </span>
          </div>
          <div className="bg-teal-50 border border-teal-100 p-4 rounded-lg text-sm text-teal-700">
            💡 <span className="font-medium">Lưu ý:</span> Vui lòng kiểm tra thông tin chi tiết trước khi xác nhận đặt dịch vụ.
          </div>
        </div>
      </div>
    </div>
  );
}
