import { useEffect, useState } from "react";
import axios from "axios";

export default function StaffWorkPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("today"); // today | week | all

  const user = JSON.parse(sessionStorage.getItem("user")) || {
    id: "68c55b7d8d0d6ec66353bce7",
    name: "Nguyễn Văn A",
  };

  // Lấy tất cả order của nhân viên
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/staff/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Fetch orders failed:", err);
      }
    };
    fetchOrders();
  }, [user.id]);

  // Lọc theo filter
  const filteredOrders = orders.filter((o) => {
    const date = new Date(o.scheduledAt);
    const today = new Date();
    if (filter === "today") {
      return date.toDateString() === today.toDateString();
    } else if (filter === "week") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return date >= weekStart && date <= weekEnd;
    }
    return true; // all
  });

  // Badge trạng thái
  const StatusBadge = ({ status }) => {
    const colors = {
      assigning: "bg-gray-100 text-gray-700",
      pending: "bg-yellow-100 text-yellow-700",
      accepted: "bg-blue-100 text-blue-700",
      in_progress: "bg-indigo-100 text-indigo-700",
      completed: "bg-green-100 text-green-700",
      canceled: "bg-red-100 text-red-700",
    };
    const labels = {
      assigning: "Đang phân công",
      pending: "Chờ xử lý",
      accepted: "Đã nhận",
      in_progress: "Đang làm",
      completed: "Hoàn thành",
      canceled: "Đã hủy",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        📋 Lịch sử làm việc của <span className="text-blue-600">{user.name}</span>
      </h1>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="font-medium">Hiển thị:</label>
        <select
          className="border rounded p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="today">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="all">Tất cả lịch sử</option>
        </select>
      </div>

      {/* Bảng lịch sử */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="p-2 text-left">Khách hàng</th>
              <th className="p-2 text-left">Dịch vụ</th>
              <th className="p-2 text-left">Chi nhánh</th>
              <th className="p-2 text-left">Ngày & giờ</th>
              <th className="p-2 text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <tr key={o._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{o.customer?.name || "—"}</td>
                  <td className="p-2">
                    {o.service?.name} {o.service?.price && `(${o.service.price.toLocaleString("vi-VN")}đ)`}
                  </td>
                  <td className="p-2">{o.branch?.name || "—"}</td>
                  <td className="p-2">{new Date(o.scheduledAt).toLocaleString("vi-VN")}</td>
                  <td className="p-2"><StatusBadge status={o.status} /></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Không có lịch sử
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
