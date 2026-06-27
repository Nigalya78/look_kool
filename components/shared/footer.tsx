"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = [
  {
    heading: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Sarees", href: "/categories/sarees" },
      { label: "New Arrivals", href: "/products" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "My Orders", href: "/account/orders" },
      { label: "Membership", href: "/account/membership" },
      { label: "Wishlist", href: "/account/dashboard" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Search", href: "/search" },
      { label: "Shipping Info", href: "#" },
      { label: "Returns & Refunds", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5B1E7A] via-purple-500 to-[#5B1E7A]" />
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 pt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex flex-col items-start mb-5 gap-1" aria-label="LookKool — Home">
              <Image
                src="/lookkool_logo.png"
                alt="LookKool"
                width={430}
                height={131}
                className="h-20 w-auto object-contain brightness-0 invert"
                style={{ width: "auto" }}
              />
              <span className="text-sm font-bold text-white/80 tracking-wide leading-tight">
                LookKool
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Premium women's fashion boutique. Designer ethnic wear, western outfits, and more delivered across India.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#5B1E7A]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-[#5B1E7A]" />
                </div>
                <span className="text-white/60 text-sm">LookKool Boutique, India</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#5B1E7A]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-[#5B1E7A]" />
                </div>
                <a href="tel:+919876543210" className="text-white/60 text-sm hover:text-[#5B1E7A] transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#5B1E7A]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-[#5B1E7A]" />
                </div>
                <a href="mailto:info@lookkool.in" className="text-white/60 text-sm hover:text-[#5B1E7A] transition-colors">info@lookkool.in</a>
              </div>
            </div>
          </div>

          {footerLinks.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-white/60 hover:text-[#5B1E7A] text-sm transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-[#5B1E7A] group-hover:w-3 transition-all duration-300" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} LookKool. All rights reserved. Made with love in India.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {["Instagram", "Facebook", "Twitter", "Pinterest"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-[#5B1E7A] rounded-lg flex items-center justify-center transition-colors text-white/60 hover:text-white text-xs font-bold"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs text-white/40">
              <Link href="#" className="hover:text-white/60 transition-colors">Privacy</Link>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <Link href="#" className="hover:text-white/60 transition-colors">Terms</Link>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>GST included</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
