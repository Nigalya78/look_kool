"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  items?: FAQItem[];
}

const defaultFAQs: FAQItem[] = [
  {
    question: "What is the material of this product?",
    answer: "Our products are crafted from high-quality materials. Specific material details can be found in the product specifications section. We ensure comfort, durability, and style in every piece.",
  },
  {
    question: "How do I choose the right size?",
    answer: "We recommend checking our size guide for accurate measurements. Each product has specific sizing information. If you're between sizes, we suggest sizing up for a comfortable fit.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day hassle-free return policy. Items must be unworn, unwashed, and with original tags attached. Simply initiate a return from your order history.",
  },
  {
    question: "How long does shipping take?",
    answer: "Standard delivery takes 3-5 business days. Express shipping (1-2 business days) is available at checkout. You'll receive tracking information once your order ships.",
  },
  {
    question: "Is this product available in other colors?",
    answer: "Color availability varies by product. Please check the color options on this page. If your preferred color is out of stock, sign up for notifications to be alerted when it's back.",
  },
];

export function ProductFAQ({ items = defaultFAQs }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-[#5B1E7A]" />
        <h3 className="text-lg font-semibold text-[#111111]">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-[#111111] text-sm pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200",
                  openIndex === index && "rotate-180"
                )}
              />
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                openIndex === index ? "max-h-96" : "max-h-0"
              )}
            >
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Still have questions?{" "}
        <a href="/contact" className="text-[#5B1E7A] font-medium hover:underline">
          Contact our support team
        </a>
      </p>
    </div>
  );
}
