// src/app/layout.js
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Navbar />
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
