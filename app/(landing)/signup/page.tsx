"use client";

import { useState } from "react";
import { registerUser } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    try {
      await registerUser(name, email, password, confirmPassword);
      console.log("Registration successful!");
    } catch (err) {
      setError((err as Error).message);
      console.error("Registration failed:", err);
    }
  };

  return (
      <div className="min-h-[65dvh] bg-[#fef9f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
          <Card className="p-6 bg-[#FFFAF4] border-0 shadow-[0_0_30px_rgba(255,138,128,0.3)]">
            <h1 className="text-2xl font-semibold text-center mb-6 text-[#ff8a80]">
              Sign Up
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-[#517970]" />
                <Input
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 border-[#517970] focus-visible:ring-[#517970]"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-[#517970]" />
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 border-[#517970] focus-visible:ring-[#517970]"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-[#517970]" />
                <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 border-[#517970] focus-visible:ring-[#517970]"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#517970]"
                >
                  {showPassword ? (
                      <Eye className="h-5 w-5" />
                  ) : (
                      <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-[#517970]" />
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Password confirmation"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 border-[#517970] focus-visible:ring-[#517970]"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-[#517970]"
                >
                  {showConfirmPassword ? (
                      <Eye className="h-5 w-5" />
                  ) : (
                      <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="pt-4 flex justify-center items-center">
                <Button
                    type="submit"
                    className="w-1/3 bg-[#ff8a80] hover:bg-[#ff8a80]/90 text-white rounded-3xl"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
  );
}
