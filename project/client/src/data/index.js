import { Home, Users, UserCog, Store, ShoppingCart, BarChart2, FileText, Gift,Calendar, ClipboardList  } from "lucide-react";


export const weekDaysLabel = [
"Thứ 2",
"Thứ 3",
"Thứ 4",
"Thứ 5",
"Thứ 6",
"Thứ 7",
"Chủ nhật",
];
export   const scheduleData = {
morning: {
    0: {
    type: "study",
    subject: "Lập trình Web",
    class: "CNTT01",
    period: "Tiết 1-3",
    room: "A101",
    teacher: "Nguyễn Văn B",
    },
    2: {
    type: "exam",
    subject: "Toán rời rạc",
    class: "CNTT02",
    period: "Tiết 1-3",
    room: "Phòng A1",
    teacher: "Trần Văn C",
    },
},
afternoon: {
    1: {
    type: "study",
    subject: "Cơ sở dữ liệu",
    class: "CNTT01",
    period: "Tiết 4-6",
    room: "B202",
    teacher: "Lê Thị D",
    },
    4: {
    type: "study",
    subject: "Mạng máy tính",
    class: "CNTT03",
    period: "Tiết 4-6",
    room: "C303",
    teacher: "Phạm Văn E",
    },
},
};

export   const menuManager = [
    { path: "/manager-dashboard", label: "Trang chủ" },
    { path: "/manager-dashboard/thong-tin", label: "Thông tin chung" },
    { path: "/manager-dashboard/hoc-tap", label: "Học tập" },
    { path: "/manager-dashboard/hoc-phi", label: "Học phí" },
    { path: "/manager-dashboard/dang-ky-hoc-phan", label: "Đăng ký học phần" },
  ];

export const menuStaff = [
  { path: "/staff-dashboard", label: "Trang chủ", icon: "home" },
  { path: "/staff-dashboard/tasks", label: "Đơn phân công", icon: "clipboard-list" }, // Xem các đơn được phân công
  { path: "/staff-dashboard/schedule", label: "Lịch làm việc trong ngày", icon: "calendar" },   // Xem lịch làm việc
  { path: "/staff-dashboard/feedback", label: "Gửi phản hồi", icon: "message-circle" }, // Báo cáo sự cố / phản hồi nội bộ
  { path: "/staff-dashboard/profile", label: "Thông tin cá nhân", icon: "user" },
];


export const menuAdmin = [
  // Trang chủ
  { path: "/admin-dashboard", label: "Trang chủ", icon: Home },

  // Quản lý người dùng
  {
    label: "Quản lý người dùng",
    children: [
      { path: "/admin-dashboard/customers", label: "Khách hàng", icon: Users },
      { path: "/admin-dashboard/employees", label: "Nhân viên & Quản lý", icon: UserCog },
    ],
  },

  // Quản lý dịch vụ & khuyến mãi
  {
    label: "Quản lý dịch vụ",
    children: [
      { path: "/admin-dashboard/services", label: "Dịch vụ", icon: FileText },
      // { path: "/admin-dashboard/promotions", label: "Khuyến mãi / Voucher", icon: Gift },  
    ],
  },
  {
    label: "Phân công nhân viên",
    children: [
      { path: "/admin-dashboard/assign-shifts", label: "Phân công dịch vụ", icon: Calendar },
      // { path: "/admin-dashboard/assign-orders", label: "Phân công dịch vụ", icon: ClipboardList },
    ],
  },
  // Quản lý đơn hàng
  // { path: "/admin-dashboard/orders", label: "Đơn đặt lịch", icon: ShoppingCart },

  // Quản lý chi nhánh
  { path: "/admin-dashboard/branches", label: "Chi nhánh", icon: Store },

  // Báo cáo & thống kê
  { path: "/admin-dashboard/reports", label: "Báo cáo", icon: BarChart2 },
];