import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/workspace-navbar'
import Footer from "@/components/footer";
import { DesktopMenu } from "@/components/workspace-desktop-menu";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Workspace for learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} bg-white flex w-full flex-col min-h-screen md:flex-row`}>
        <DesktopMenu />
        <div className="flex flex-col w-full">
        <Navbar />

          <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
          </main>
          <Footer />
        </div>
        
      </div>
  )
}