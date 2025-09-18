import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function AssignForm({ orderId, onClose, onSuccess }) {
  const [order, setOrder] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [status, setStatus] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
    setOrder(res.data);

    setStaffId(res.data.staff?._id || "");
    setStatus(res.data.status || "pending");
    setScheduledAt(
      res.data.scheduledAt
        ? new Date(res.data.scheduledAt).toISOString().slice(0, 16)
        : ""
    );

    if (res.data.branch?._id) {
      fetchEmployees(res.data.branch._id);
    }
  };

  const fetchEmployees = async (branchId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/employees/branch/${branchId}`
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Lỗi fetch employees", err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
        staffId,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi update order", err);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="text-lg font-semibold">Phân công đơn hàng</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <InfoField label="Khách hàng" value={order.customer?.name} />
          <InfoField label="Dịch vụ" value={order.service?.name} />
          <InfoField label="Chi nhánh" value={order.branch?.name} />

          <div>
            <label className="block text-sm font-medium mb-1">Nhân viên</label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chưa phân công --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Thời gian làm</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                <option value="assigning">Đang phân công</option>
                <option value="pending">Chờ xử lý</option>
                <option value="accepted">Đã nhận</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="canceled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-5 py-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <p className="p-2 bg-gray-100 rounded-lg">{value || "—"}</p>
    </div>
  );
}
