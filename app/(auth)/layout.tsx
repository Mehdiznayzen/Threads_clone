import React from "react";
import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
// import { dark } from "@clerk/themes";

import "../globals.css";

const font = Roboto_Slab({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Auth",
    description: "Generated by create next app",
    icons : '/logo.svg'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                // baseTheme: dark,
            }}
        >
            <html lang='en'>
                <body 
                    className={`${font.className} bg-dark-1 w-full min-h-screen flex justify-center`}
                >
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}