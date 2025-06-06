import type { Metadata } from 'next'
import { Navbar } from '@/components/landing/navbar'
import Footer from "@/components/landing/footer";
import { Jura } from 'next/font/google';

const jura = Jura({
  subsets: ['latin'],

});

export const metadata: Metadata = {
  title: 'Memoria',
  description: 'Study smarter, not harder.',
  icons: {
    icon: '../favicon.ico',
    shortcut: '../favicon.ico',
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
})  {
    return (
    <div className={`${jura.className} bg-[--background] flex flex-col min-h-screen w-full`}>
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8" >
          {children}
        </main>
        <Footer />
      </div>
  )
}