import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  ListChecks,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Meta from "../../components/Meta";

export default function OrderHistory({ customerId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!customerId) {
          console.warn("⚠️ Chưa có customerId để lấy đơn hàng");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/orders/customer/${customerId}`
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customerId]);

  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
            <Clock size={14} className="mr-1" /> Chờ xác nhận
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            <CheckCircle2 size={14} className="mr-1" /> Đã nhận
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-full">
            <Clock size={14} className="mr-1" /> Đang thực hiện
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            <CheckCircle2 size={14} className="mr-1" /> Hoàn thành
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
            <XCircle size={14} className="mr-1" /> Đã hủy
          </span>
        );
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <Meta title={"Lịch sử đơn hàng"} />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-10">
          <ListChecks className="text-teal-600 mr-2" size={30} />
          <h1 className="text-3xl font-bold text-gray-800">
            Lịch sử đơn dịch vụ
          </h1>
        </div>

        {/* Content */}
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 bg-white py-14 rounded-xl shadow">
            Bạn chưa có đơn dịch vụ nào.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer border border-gray-100"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                {/* Top */}
                <div className="flex justify-between items-start p-6 border-b">
                  <div>
                    <h2 className="font-semibold text-xl text-teal-700">
                      {order.service?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Mã đơn: {order._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  {renderStatus(order.status)}
                </div>

                {/* Info */}
                <div className="p-6 text-sm text-gray-600 space-y-3">
                  <p className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {new Date(order.scheduledAt).toLocaleDateString("vi-VN")}{" "}
                    lúc{" "}
                    {new Date(order.scheduledAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className="flex items-center">
                    <UserRound size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium">Nhân viên: {" "}</span>
                    {order.staff
                      ? order.staff.name || order.staff.email
                      : "⏳ Chờ phân công"}
                  </p>

                  <p>
                    <span className="font-medium">Thanh toán:</span>{" "}
                    {order.paymentMethod === "COD"
                      ? "Khi hoàn thành"
                      : "Online (Momo)"}
                  </p>

                  <p className="font-semibold text-gray-800 text-lg">
                    Tổng tiền:{" "}
                    {order.service?.price?.toLocaleString("vi-VN")} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}