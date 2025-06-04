"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Settings() {
  const [language, setLanguage] = useState("en")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handlePasswordUpdate = () => {
    console.log("Update Password clicked:", { currentPassword, newPassword, confirmPassword })
  }

  return (
    <div className="bg-white px-4">
      <h1 className="text-xl font-semibold text-[#5c7d73] mb-4">Settings</h1>
      <div className="mb-8">
        <label htmlFor="language-select" className="block text-lg font-semibold text-[#5c7d73] mb-2">Language</label>
        <select
          id="language-select"
          className="w-full rounded-md border-2 border-[#5c7d73] px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#5c7d73] focus:border-[#5c7d73] appearance-none pr-8 leading-tight"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="uk">Ukrainian</option>
        </select>
      </div>
      <div className="mb-8">
        <p className="text-[#5c7d73] mb-4 text-lg font-semibold">Update your password to keep your account secure.</p>
        <div className="mb-4">
          <label htmlFor="current-password" className="block text-base font-semibold text-[#5c7d73] mb-2">Current password</label>
          <input
            id="current-password"
            type="password"
            className="w-full rounded-md border-2 border-[#5c7d73] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5c7d73] focus:border-[#5c7d73]"
            placeholder="Example"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="new-password" className="block text-base font-semibold text-[#5c7d73] mb-2">New password</label>
          <input
            id="new-password"
            type="password"
            className="w-full rounded-md border-2 border-[#5c7d73] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5c7d73] focus:border-[#5c7d73]"
            placeholder="Example"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="confirm-password" className="block text-base font-semibold text-[#5c7d73] mb-2">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            className="w-full rounded-md border-2 border-[#5c7d73] px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5c7d73] focus:border-[#5c7d73]"
            placeholder="Example"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button
          size="wide"
          onClick={handlePasswordUpdate}
        >
          Update Password
        </Button>
      </div>
    </div>
  )
}