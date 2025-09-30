import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import Meta from "../components/Meta";

const heroImages = [
  "https://www.btaskee.com/wp-content/uploads/2021/01/tai-sao-chon-upholstery-cleaning-ver3.png",
  "https://www.btaskee.com/wp-content/uploads/2020/11/home-page-an-tam-voi-lua-chon-cua-ban.png",
  "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-addon-glasses.jpeg",
  "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-addon-vacuuming.jpeg",
  "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-compare-team.jpeg",
];

const features = [
  {
    title: "Đặt lịch nhanh chóng",
    desc: "Chỉ 60 giây thao tác trên ứng dụng, có ngay người nhận việc.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-deep-cleaning.png",
  },
  {
    title: "Giá cả rõ ràng",
    desc: "Giá dịch vụ minh bạch, không phí phát sinh.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/10/cong-tac-vien-.jpg",
  },
  {
    title: "Đa dạng dịch vụ",
    desc: "Với hơn 9 dịch vụ tiện ích, đáp ứng mọi nhu cầu việc nhà.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-deep-cleaning.png",
  },
  {
    title: "An toàn tối đa",
    desc: "Người làm uy tín, hồ sơ rõ ràng, được công ty giám sát.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-ac-cleaning.png",
  },
  {
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ luôn sẵn sàng giải đáp mọi thắc mắc của bạn.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-laundry.png",
  },
  {
    title: "Ưu đãi hấp dẫn",
    desc: "Chương trình giảm giá đặc biệt cho khách hàng mới và thân thiết.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-home-cooking.png",
  },
  {
    title: "Dịch vụ chuyên nghiệp",
    desc: "Nhân viên được đào tạo, uy tín và thân thiện.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-ac-housekeeping.png",
  },
  {
    title: "Theo dõi đơn giản",
    desc: "Quản lý lịch hẹn và trạng thái công việc dễ dàng.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-disinfection.png",
  },
];

const howItWorks = [
  { step: 1, title: "Chọn dịch vụ", desc: "Chọn dịch vụ phù hợp với nhu cầu của bạn." },
  { step: 2, title: "Đặt lịch nhanh chóng", desc: "Chỉ cần vài giây trên app là có lịch hẹn." },
  { step: 3, title: "Theo dõi & đánh giá", desc: "Theo dõi tiến trình và đánh giá sau khi hoàn thành." },
];

const services = [
  { title: "Dọn nhà", img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-deep-cleaning.png" },
  { title: "Giặt ủi", img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-ac-housekeeping.png" },
  { title: "Rửa xe", img: "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-compare-task.jpeg" },
  { title: "Chăm sóc cây", img: "http://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-area-lobby.jpeg" },
  { title: "Nấu ăn", img: "http://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-area-toilet.jpeg" },
  { title: "Vệ sinh văn phòng", img: "http://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-area-elevator.jpeg" },
];

const testimonials = [
  { name: "Nguyễn Văn A", text: "Dịch vụ nhanh chóng, nhân viên nhiệt tình.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Trần Thị B", text: "Mọi thứ minh bạch và uy tín.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Lê Văn C", text: "Rất hài lòng với dịch vụ!", avatar: "https://randomuser.me/api/portraits/men/56.jpg" },
  { name: "Phạm Thị D", text: "Sẽ tiếp tục sử dụng lâu dài.", avatar: "https://randomuser.me/api/portraits/women/66.jpg" },
];

const faqs = [
  { q: "Ứng dụng triển khai ở đâu?", a: "Hiện tại hơn 20 tỉnh thành và 3 quốc gia Đông Nam Á." },
  { q: "Chất lượng dịch vụ đảm bảo không?", a: "CTV có kinh nghiệm, được kiểm tra trước khi nhận việc." },
  { q: "Đăng việc mất bao lâu?", a: "Trong vòng 1 giờ sẽ có người nhận, trừ lễ/giờ cao điểm." },
  { q: "Có làm việc ngày Lễ/Tết không?", a: "Hoạt động xuyên suốt, nên đặt trước 1-2 ngày." },
];

export default function HomePage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <Meta title={"Trang chủ"} />
      <div className="relative w-full h-[700px] md:h-[750px] lg:h-[800px]">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500 }}
          loop
          pagination={{ clickable: true }}
        >
          {heroImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full">
                <img
                  src={img}
                  alt={`slide-${i}`}
                  className="w-full h-[600px] object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10 flex flex-col items-center justify-center text-center text-white px-6">
                  <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
                    Giải pháp việc nhà tiện lợi
                  </h1>
                  <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow">
                    Nhanh chóng, minh bạch và an toàn
                  </p>
                  <button className="mt-6 px-8 py-3 bg-[#ff8228] text-white rounded-full shadow hover:bg-orange-600 transition transform hover:scale-105">
                    <Link to='/service'> Đặt dịch vụ ngay</Link>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="p-4 bg-teal-50 rounded-full">
              <img src={f.img} alt={f.title} className="w-12 h-12" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">{f.title}</h3>
            <p className="text-gray-600 text-sm mt-2 text-center">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Quy trình 3 bước
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((step) => (
            <div key={step.step} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <div className="text-4xl font-bold text-teal-600 mb-4">{step.step}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Gallery */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Dịch vụ nổi bật
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
              <img src={s.img} alt={s.title} className="w-full h-60 object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <button className="px-6 py-2 bg-orange-500 text-white rounded-full">
                  <Link to='service'>Đặt ngay</Link>
                </button>
              </div>
              <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg drop-shadow">{s.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-gray-100 rounded-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Khách hàng nói gì
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                <h3 className="font-semibold text-gray-800">{t.name}</h3>
              </div>
              <p className="text-gray-600">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-white cursor-pointer transition hover:bg-indigo-100"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">{faq.q}</h3>
                <svg
                  width="18"
                  height="18"
                  className={`transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openIndex === i && (
                <p className="mt-3 text-sm text-gray-600">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-gradient-to-r from-teal-500 to-teal-700 py-12 text-center text-white">
        <h3 className="text-2xl md:text-3xl font-semibold drop-shadow">
          Sẵn sàng trải nghiệm dịch vụ tiện lợi?
        </h3>
        <button className="mt-6 px-8 py-3 bg-white text-teal-700 rounded-lg shadow hover:bg-gray-100 transition transform hover:scale-105">
          Đặt ngay
        </button>
      </footer>
    </div>
  );
}
