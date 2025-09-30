import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Meta from "../../components/Meta";

export default function Booking() {
  const { id } = useParams(); // service id
  const navigate = useNavigate();
  const { user } = useUser();

  const [service, setService] = useState(null);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch: "",
    date: "",
    time: "",
    notes: "",
    paymentStatus:"",
    paymentMethod: "COD",
  });

  // Lấy thông tin dịch vụ
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/services/get/${id}`)
      .then((res) => setService(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Lấy danh sách chi nhánh
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/branches/getall")
      .then((res) => setBranches(res.data))
      .catch((err) => console.error("Fetch branches failed:", err));
  }, []);

  // Đồng bộ customer với Clerk
  useEffect(() => {
    if (user) {
      axios
        .post("http://localhost:5000/api/auth/sync", {
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          phone: user.primaryPhoneNumber?.phoneNumber,
        })
        .then((res) => {
          localStorage.setItem("customerId", res.data.customer.clerkId);
        })
        .catch((err) => console.error("Sync customer failed:", err));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập trước khi đặt dịch vụ!");
      return;
    }

    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      toast.error("Không tìm thấy thông tin khách hàng, vui lòng thử lại!");
      return;
    }
    if (!formData.branch) {
      toast.error("Vui lòng chọn chi nhánh!");
      return;
    }

    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}`);

      if (formData.paymentMethod === "COD") {
        // Thanh toán COD -> tạo order trực tiếp
        await axios.post("http://localhost:5000/api/orders", {
          customer: customerId,
          service: id,
          branch: formData.branch,
          scheduledAt,
          notes: formData.notes,
          price: service.price,
          paymentStatus:"unpaid",
          paymentMethod: "COD",
        });
        toast.success("Đặt dịch vụ thành công!");
        navigate("/orders-susscess");
      } else {
        // Thanh toán MoMo -> gọi API /momo/create
        const res = await axios.post("http://localhost:5000/api/momo/create", {
          amount: service.price,
          orderInfo: `Thanh toán dịch vụ: ${service.name}`,
          customer: customerId,
          branch: formData.branch,
          products: [
            { serviceId: id, name: service.name, price: service.price },
          ],
          paymentMethod: "Thanh toán Momo",
        });

        if (res.data.payUrl) {
          window.location.href = res.data.payUrl; // redirect sang MoMo
        } else {
          toast.error("Không tạo được giao dịch MoMo!");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi đặt dịch vụ!");
    }
  };

  if (!service) return <p className="text-center mt-10">Đang tải dịch vụ...</p>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Meta title={`Đặt dịch vụ ${service?.name}`}/>
      <h1 className="text-3xl font-bold mb-6 text-center">
        Đặt dịch vụ: {service.name}
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 border">
        <p className="text-gray-600 mb-4">{service.description}</p>
        <p className="text-lg font-semibold mb-6 text-teal-600">
          Giá: {service.price.toLocaleString()} VND
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chi nhánh */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Chọn chi nhánh
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">-- Chọn chi nhánh --</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} - {b.address}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày */}
          <div>
            <label className="block text-sm font-medium mb-1">Ngày</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Giờ */}
          <div>
            <label className="block text-sm font-medium mb-1">Giờ</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ví dụ: Mang theo dụng cụ vệ sinh..."
            />
          </div>

          {/* Thanh toán */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phương thức thanh toán
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="COD">Thanh toán khi hoàn thành (COD)</option>
              <option value="Thanh toán Momo">Thanh toán qua MoMo</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition"
          >
            Xác nhận đặt dịch vụ
          </button>
        </form>
      </div>
    </div>
  );
}