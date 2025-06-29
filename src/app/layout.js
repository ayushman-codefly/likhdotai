import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Likh Ai",
  description: "Multilingual Typing Assistant for seamless content creation",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html className="bg-white overflow-x-hidden" lang="en" suppressHydrationWarning>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/swalekh-sdk@2.6.0/swalekh.js" />
          <script src="https://cdn.jsdelivr.net/npm/reverie-stt-sdk/dist/bundle.js" />
        </head>
        <body className={interSans.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
