import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { CalendarClock, Lock } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "sonner";
import SignOutButton from "@/components/sign-out-button";
import { createClient } from "@/utils/supabase/server";
import LoginWithGoogleButton from "@/components/login-with-google-button";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Ledig",
  description: "TODO",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold justify-between w-full">
                    <Link
                      className="flex gap-2 justify-center items-center"
                      href="/"
                    >
                      <CalendarClock className="w-4 h-4" /> Ledig
                    </Link>
                    <div className="flex gap-4 justify-center items-center">
                      <ModeToggle />
                      {user ? <SignOutButton /> : <LoginWithGoogleButton />}
                    </div>
                  </div>
                </div>
              </nav>
              <div className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>
            </div>
          </main>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
