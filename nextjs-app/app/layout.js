import "./globals.css";

export const metadata = {
  title: "WebSocket Hands-on",
};

export default function RootLayout({ children }) {
  return (
    <html lang="jp">
      <body>{children}</body>
    </html>
  );
}
