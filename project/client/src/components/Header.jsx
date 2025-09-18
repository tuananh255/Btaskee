import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const navLinks = [
    { title: "TRANG CHỦ", href: "/" },
    { title: "DỊCH VỤ DỌN NHÀ", href: "/dich-vu-don-nha" },
    { title: "GIỚI THIỆU", href: "/about" },
    { title: "LIÊN HỆ", href: "/contact" },
    { title: "KHUYẾN MÃI", href: "/khuyen-mai" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="https://www.btaskee.com/wp-content/uploads/2020/11/logo_btaskee_ver_3.png"
            alt="Btaskee"
            className="h-10 md:h-12"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-800">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              className="hover:text-[#ff8228] transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Desktop User + Cart */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Lịch sử đặt dịch vụ"
                  onClick={() => navigate("/lich-su-dat-hang")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={openSignIn}
              className="px-6 py-2 cursor-pointer rounded-full bg-[#ff8228] text-white hover:bg-orange-600 transition-all"
            >
              Đăng nhập
            </button>
          )}

          <button className="relative">
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h2l.4 2M7 13h14l-1.5 8H6l-1.5-8z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              className="w-6 h-6 text-[#ff8228]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-gray-800 flex flex-col items-center justify-center gap-8 text-lg font-medium transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-[#ff8228]"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.href} onClick={() => setIsMenuOpen(false)}>
            {link.title}
          </Link>
        ))}

        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={openSignIn}
            className="bg-[#ff8228] cursor-pointer text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-all"
          >
            Đăng nhập
          </button>
        )}

        <button className="relative mt-4">
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 3h2l.4 2M7 13h14l-1.5 8H6l-1.5-8z" />
          </svg>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
      </div>
      <hr />
    </header>
  );
}
