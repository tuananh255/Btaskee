const CustomerModel = require("../models/CustomerModel");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const WorkAssignment = require("../models/WorkAssignmentModel");
// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const { customer, service, branch, scheduledAt, notes, price, paymentMethod, paymentStatus } = req.body;

    const existingCustomer = await CustomerModel.findOne({ clerkId: customer });
    if (!existingCustomer) {
      return res.status(400).json({ error: "Customer not found" });
    }

    const order = new Order({
      customer: existingCustomer._id,
      service,
      branch,
      scheduledAt,
      notes,
      price,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || "unpaid",
      status: "assigning",
    });

    const staffList = await User.find({ role: "staff", branch });
    const availableStaff = [];
    const start = new Date(scheduledAt);
    start.setHours(0, 0, 0, 0);
    const end = new Date(scheduledAt);
    end.setHours(23, 59, 59, 999);

    for (const staff of staffList) {
      const busyOrders = await Order.findOne({
        staff: staff._id,
        scheduledAt: { $gte: start, $lte: end },
        status: { $nin: ["completed", "canceled"] }, 
      });

      const busyAssignments = await WorkAssignment.findOne({
        staff: staff._id,
        startTime: { $lte: end },
        endTime: { $gte: start },
        status: { $nin: ["completed", "canceled"] },
      });

      if (!busyOrders && !busyAssignments) {
        availableStaff.push(staff);
      }
    }

    if (availableStaff.length === 0) {
      await order.save(); 
      return res.status(200).json({
        message: "Không có nhân viên rảnh. Đơn được lưu ở trạng thái chờ phân công.",
        order,
      });
    }

    const assignedStaff = availableStaff[0];
    order.staff = assignedStaff._id;
    order.status = "pending";
    await order.save();

    const populated = await Order.findById(order._id)
      .populate("customer", "name phone")
      .populate("service", "name")
      .populate("branch", "name")
      .populate("staff", "name email");

    res.status(201).json({
      message: `Đơn đã được phân công cho nhân viên ${assignedStaff.name}`,
      order: populated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả đơn
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name phone email")
      .populate("staff", "name phone email")
      .populate("service", "name price")
      .populate("branch", "name address");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy đơn theo ID
const getOrderById = async (req, res) => {
  try {
    console.log(req.params.id)
    const order = await Order.findById(req.params.id)
      .populate("customer", "name phone email")
      .populate("staff", "name phone email")
      .populate("service", "name price")
      .populate("branch", "name address");

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy đơn theo khách hàng
const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params; // clerkId

    const customer = await CustomerModel.findOne({ clerkId: customerId });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const orders = await Order.find({ customer: customer._id })
      .populate("staff", "name phone email")
      .populate("service", "name price")
      .populate("branch", "name address");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Update đơn hàng chung
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { staffId, status, scheduledAt, notes } = req.body;

    const updateData = {};

    if (staffId) updateData.staff = staffId;

    const validStatuses = ["assigning","pending","accepted","in_progress","completed","canceled"];
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      updateData.status = status;
    }

    if (scheduledAt) {
      const date = new Date(scheduledAt);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid scheduledAt date" });
      }
      updateData.scheduledAt = date;
    }

    if (notes) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true })
      .populate("customer", "name phone email")
      .populate("staff", "name phone email")
      .populate("service", "name price")
      .populate("branch", "name address");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Xóa đơn
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Staff xem lịch làm việc
// Staff xem lịch làm việc
const getOrdersByStaffAndDate = async (req, res) => {
  try {
    const { staffId } = req.params; // lấy staffId từ params
    const { date } = req.query;

    let query = { staff: staffId }; // ✅ staff là ObjectId, không phải staff._id

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.scheduledAt = { $gte: start, $lte: end };
    }

    const orders = await Order.find(query)
      .populate("customer", "name phone email")
      .populate("service", "name price")
      .populate("branch", "name address")
      .populate("staff", "name phone email");

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const  getAssignedOrdersByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const orders = await Order.find({ staff: staffId })
      .populate("customer", "name")
      .populate("service", "name price")
      .populate("branch", "name");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  updateOrder,
  deleteOrder,
  getOrdersByStaffAndDate,getAssignedOrdersByStaff
}
