'use client';

import { usePathname } from "next/navigation";

export function PathNameProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Determine the appropriate class based on the pathname
  let pathClass = '';
  
  if (pathname === '/myprofile') {
    pathClass = 'pathname-myprofile';
  } else if (pathname === '/myprofile/payment') {
    pathClass = 'pathname-payment';
  } else if (pathname === '/myprofile/purchases') {
    pathClass = 'pathname-purchases';
  }
  
  return (
    <div className={pathClass}>
      {children}
    </div>
  );
} 