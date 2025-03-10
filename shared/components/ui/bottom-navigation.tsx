"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChartSpline, LayoutGrid, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/workouts", icon: LayoutGrid, label: "Workouts" },
  { href: "/stats", icon: ChartSpline, label: "Stats" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
		<div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full px-7 max-w-[430px]">
    	<nav className="w-full bg-bgSurface shadow-2xl rounded-full p-1 flex justify-between items-center border border-muted/25">
    	  {navItems.map(({ href, icon: Icon }) => {
    	    const isActive = pathname === href;
    	    return (
    	      <Link key={href} href={href}  className="relative flex flex-col items-center justify-center">
    	        <div
    	          className={`p-4 rounded-full transition-all ${
    	            isActive ? "bg-accent text-primary" : "text-muted"
    	          }`}
    	        >
    	          <Icon size={26} strokeWidth={2} />
    	        </div>
    	      </Link>
    	    );
    	  })}
    	</nav>
		</div>
  );
}
