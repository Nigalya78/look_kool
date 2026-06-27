"use client";

import Link from "next/link";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BackButton {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  backButton?: BackButton;
}

export function Breadcrumbs({ items, backButton }: BreadcrumbsProps) {
  return (
    <div className="flex items-center justify-between">
      <nav aria-label="Breadcrumb" className="flex items-center min-w-0 overflow-hidden">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 shrink-0"
      >
        <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className={`flex items-center min-w-0 ${isLast ? "overflow-hidden" : "shrink-0"}`}>
            <ChevronRight className="w-3.5 h-3.5 mx-0.5 sm:mx-1 text-muted-foreground shrink-0" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-[11px] sm:text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[11px] sm:text-sm text-foreground font-medium truncate" aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
      </nav>

      {/* Back Button (e.g., Return to Checkout) */}
      {backButton && (
        <Link
          href={backButton.href}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors ml-4 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{backButton.label}</span>
        </Link>
      )}
    </div>
  );
}
