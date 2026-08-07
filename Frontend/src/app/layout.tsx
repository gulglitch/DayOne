import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import "@fontsource-variable/fraunces/standard.css";
import "@fontsource-variable/fraunces/standard-italic.css";
import "@fontsource-variable/inter/standard.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Day One — Every company starts with an idea",
  description:
    "Day One turns a single sentence into a founding team of AI agents that research, argue, and build a real startup plan while you watch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink font-body antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
