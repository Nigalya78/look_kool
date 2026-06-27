"use client";

import { useState } from "react";
import { Ruler, X } from "lucide-react";

interface SizeChartData {
  size: string;
  bust?: number | null;
  waist?: number | null;
  hip?: number | null;
  length?: number | null;
}

interface SizeChartProps {
  sizeChart: SizeChartData[];
}

const DEFAULT_SIZE_CHART: SizeChartData[] = [
  { size: "S", bust: 34, waist: 28, hip: 36, length: 48 },
  { size: "M", bust: 36, waist: 30, hip: 38, length: 48 },
  { size: "L", bust: 38, waist: 32, hip: 40, length: 49 },
  { size: "XL", bust: 40, waist: 34, hip: 42, length: 49 },
  { size: "XXL", bust: 42, waist: 36, hip: 44, length: 50 },
];

export function SizeChart({ sizeChart }: SizeChartProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const chartData = sizeChart.length > 0 ? sizeChart : DEFAULT_SIZE_CHART;
  
  return (
    <>
      {/* Size Chart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-[#5B1E7A] hover:text-[#4A1870] font-medium transition-colors"
      >
        <Ruler className="w-4 h-4" />
        Size Chart
      </button>
      
      {/* Size Chart Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[#111111]">Size Chart</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <p className="text-sm text-gray-500 mb-4">
                All measurements are in inches. Measurements may vary slightly by style.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-[#111111]">Size</th>
                      <th className="text-center py-3 px-2 font-semibold text-[#111111]">Bust</th>
                      <th className="text-center py-3 px-2 font-semibold text-[#111111]">Waist</th>
                      <th className="text-center py-3 px-2 font-semibold text-[#111111]">Hip</th>
                      <th className="text-center py-3 px-2 font-semibold text-[#111111]">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((row) => (
                      <tr key={row.size} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-2 font-medium text-[#111111]">{row.size}</td>
                        <td className="text-center py-3 px-2 text-gray-600">{row.bust || "-"}</td>
                        <td className="text-center py-3 px-2 text-gray-600">{row.waist || "-"}</td>
                        <td className="text-center py-3 px-2 text-gray-600">{row.hip || "-"}</td>
                        <td className="text-center py-3 px-2 text-gray-600">{row.length || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* How to Measure */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-[#111111] mb-2">How to Measure</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Bust:</strong> Measure around the fullest part of your bust</li>
                  <li><strong>Waist:</strong> Measure around your natural waistline</li>
                  <li><strong>Hip:</strong> Measure around the fullest part of your hips</li>
                  <li><strong>Length:</strong> Measure from shoulder to hem</li>
                </ul>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-[#5B1E7A] text-white rounded-lg font-medium hover:bg-[#4A1870] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Size selector component
interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#111111]">Select Size</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`
              w-12 h-12 rounded-lg border-2 font-medium text-sm transition-all
              ${selectedSize === size
                ? "border-[#5B1E7A] bg-[#5B1E7A] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-[#5B1E7A] hover:text-[#5B1E7A]"
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
