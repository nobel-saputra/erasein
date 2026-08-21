import type { Metadata } from "next";
import "./globals.css";
import { InlineScript } from "@/components/inline-script";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "EraseIn - Remove Background Free and Unlimited",
  description: "Remove backgrounds from thousands of images for FREE & UNLIMITED.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <InlineScript
          html={`(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");var f=document.getElementById("favicon");if(f)f.href=d?"/black.ico":"/white.ico";}catch(e){}})();`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="icon" id="favicon" href="/white.ico" type="image/x-icon" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
   