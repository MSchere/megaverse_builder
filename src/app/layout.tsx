import "$src/app/styles/globals.css";

import { Inter } from "next/font/google";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "./components/ui/toaster";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata = {
    title: "Megaverse Builder 🪐",
    description: "Create your very own universe!",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`font-sans ${inter.variable}`}>
                <Toaster />
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
