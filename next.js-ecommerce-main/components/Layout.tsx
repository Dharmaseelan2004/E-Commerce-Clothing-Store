import Head from "next/head";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../utils/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";
import { BsInstagram, BsWhatsapp } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";
import { useTheme } from "next-themes";
import ThemeToogle from "./ThemeToogle";

const Layout = ({ title, children }: any) => {
  const { theme } = useTheme();
  const { status, data: session }: any = useSession();
  const { state, dispatch } = useContext(StoreContext);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a: any, c: any) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Outfit Clothes` : "Outfit Clothes"}</title>
        <meta name="description" content="store of clothes" />
        <link rel="icon" href="/ecommerce2.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />
      <div className="flex min-h-screen flex-col justify-between bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">

        {/* HEADER */}
        <header className="sticky top-0 z-50 shadow-md bg-white/80 backdrop-blur-lg dark:bg-gray-900/70">
          <nav className="flex h-14 px-6 justify-between items-center">
            <Link href="/">
              <p className="text-xl font-extrabold tracking-wide text-pink-600 hover:scale-105 transition-transform">
                Outfit Store
              </p>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToogle />

              <Link href="/cart" className="relative group">
                <FaCartArrowDown className="text-2xl group-hover:scale-110 transition-transform" />
                {cart.cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {status === "loading" ? (
                <p>Loading...</p>
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600 font-semibold hover:underline">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white dark:bg-gray-800 border dark:border-gray-700">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/order-history">
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink className="dropdown-link" href="/admin/dashboard">
                          Admin Panel
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <button
                        onClick={logoutClickHandler}
                        className="w-full text-left px-4 py-2 hover:bg-pink-100 dark:hover:bg-gray-700 rounded-b-xl"
                      >
                        Logout
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <p className="px-3 py-1 hover:bg-pink-100 rounded-lg transition">Login</p>
                </Link>
              )}
            </div>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="container mx-auto mt-6 px-4">{children}</main>

        {/* FOOTER WITH MARQUEE */}
        <footer className="relative overflow-hidden mt-6">
          <div className="absolute inset-0 pointer-events-none footer-wave"></div>
          <div className="relative z-10 flex items-center justify-between px-6 py-5 min-h-[80px]">
            {/* Marquee */}
            <div className="marquee-wrapper flex-1 mr-4">
              <div className="marquee-content">
                <span className="glow-gradient marquee-text">
                  © 2025 Dharma Store — Fresh Styles • Fast Delivery • Trusted Quality ✨
                </span>
                <span className="glow-gradient marquee-text">
                  © 2025 Dharma Store — Fresh Styles • Fast Delivery • Trusted Quality ✨
                </span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              <Link href="https://www.instagram.com/dharma_ktm_lover/" className="social-btn">
                <BsInstagram />
              </Link>
              <Link href="https://wa.me/919361090810?text=Hello%2C%20I%20want%20to%20know%20about%20your%20products" className="social-btn">
                <BsWhatsapp />
              </Link>
            </div>
          </div>

          {/* INLINE CSS */}
          <style jsx>{`
            .footer-wave {
              background: radial-gradient(1200px 220px at 10% 20%, rgba(255,120,180,0.06), transparent 10%),
                radial-gradient(1000px 200px at 90% 80%, rgba(0,120,255,0.04), transparent 8%),
                linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05));
              backdrop-filter: blur(6px);
              transform: skewY(-2deg);
              animation: waveShift 12s linear infinite;
              opacity: 0.95;
            }

            @keyframes waveShift {
              0% {
                background-position: 0% 0%, 0% 100%, 0% 0%;
              }
              50% {
                background-position: 50% 10%, 50% 90%, 50% 0%;
              }
              100% {
                background-position: 100% 0%, 100% 100%, 100% 0%;
              }
            }

            .marquee-wrapper {
              overflow: hidden;
              position: relative;
              width: 100%;
              display: block;
              height: 36px;
            }

            .marquee-content {
              display: inline-flex;
              width: max-content;
              gap: 4rem;
              align-items: center;
              animation: marqueeMove 16s linear infinite;
            }

            .marquee-wrapper:hover .marquee-content {
              animation-play-state: paused;
            }

            @keyframes marqueeMove {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .glow-gradient {
              background: linear-gradient(90deg, #ff007a, #ff6f00, #00aaff, #7c4dff, #ff007a);
              background-size: 300% 100%;
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              font-weight: 700;
              font-size: 1rem;
              letter-spacing: 0.6px;
              display: inline-block;
              animation: gradientShift 6s linear infinite, textGlow 2.8s ease-in-out infinite;
            }

            @keyframes gradientShift {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }

            @keyframes textGlow {
              0% {
                text-shadow: 0 0 0 rgba(0, 0, 0, 0);
              }
              50% {
                text-shadow: 0 6px 18px rgba(124, 77, 255, 0.14), 0 0 10px rgba(0, 170, 255, 0.06);
              }
              100% {
                text-shadow: 0 0 0 rgba(0, 0, 0, 0);
              }
            }

            .marquee-text {
              font-size: 0.95rem;
              white-space: nowrap;
              padding-right: 3rem;
            }

            .social-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 44px;
              height: 44px;
              border-radius: 10px;
              transition: transform 0.24s ease, box-shadow 0.24s ease;
              font-size: 1.3rem;
              background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
              box-shadow: 0 4px 12px rgba(2, 6, 23, 0.06);
              color: #111827;
            }

            .social-btn:hover {
              transform: translateY(-6px) scale(1.05);
              box-shadow: 0 12px 30px rgba(124, 77, 255, 0.15);
            }

            @media (max-width: 640px) {
              .marquee-wrapper {
                height: 28px;
              }
              .marquee-text {
                font-size: 0.9rem;
                padding-right: 2rem;
              }
              .social-btn {
                width: 40px;
                height: 40px;
                font-size: 1.1rem;
              }
            }
          `}</style>
        </footer>
      </div>
    </>
  );
};

export default Layout;
