import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduSmart Pro - Platform Ujian AI",
  description: "EduSmart Pro - Multi-Account Exam Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
