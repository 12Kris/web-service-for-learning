"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setFormData({ name: "", email: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100 dark:from-gray-950 dark:to-gray-900 px-4 text-[--neutral]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg  max-w-2xl mx-auto">
            {`If you have any questions, feel free to reach out to us. We're here to help and would love to hear from you.`}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden border-sage-200 dark:border-sage-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-sage-100 dark:bg-sage-900/50 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-sage-600 dark:text-sage-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">contact@memoria.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-sage-100 dark:bg-sage-900/50 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-sage-600 dark:text-sage-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">+ (380) 88 88 88 888</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-sage-100 dark:bg-sage-900/50 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-sage-600 dark:text-sage-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        IT Step
                        <br />
                        Lviv, UA
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="md:col-span-2 border-sage-200 dark:border-sage-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900 dark:text-white">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="bg-white/70 dark:bg-gray-800/70 border-sage-200 dark:border-sage-800 focus:border-sage-500 focus:ring-sage-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 dark:text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="bg-white/70 dark:bg-gray-800/70 border-sage-200 dark:border-sage-800 focus:border-sage-500 focus:ring-sage-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-900 dark:text-white">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    className="min-h-[150px] bg-white/70 dark:bg-gray-800/70 border-sage-200 dark:border-sage-800 focus:border-sage-500 focus:ring-sage-500"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  {isSubmitting ? (
                    <Button disabled size="sm" className="w-full sm:w-auto">
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    </Button>
                  ) : (
                    <Button type="submit" size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
