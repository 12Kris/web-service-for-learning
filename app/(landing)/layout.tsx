import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import Footer from "@/components/footer";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web Service For Learning',
  description: 'Web Service For Learning is a web service for learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
})  {
    return (
    <div className={`${inter.className} bg-[--background] flex flex-col min-h-screen w-full`}>
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8" >
          {children}
        </main>
        <Footer />
      </div>
  )
}