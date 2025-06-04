"use client"

import Link from "next/link"

export default function Footer() {
    return (
        <footer className=" w-full bg-background border-t border-gray-200 mt-8 sm:px-6 lg:px-8 text-[--neutral]">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
                    <p className="text-center md:text-left mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} All rights reserved.
                    </p>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-center md:text-left">
                        <Link href="/privacy-policy" className="hover:text-primary">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-of-service" className="hover:text-primary">
                            Terms of Service
                        </Link>
                        <Link href="/contact" className="hover:text-primary">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
