"use client";

import { useState, useTransition } from "react";
import { loginUser } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await loginUser(formData.email, formData.password);
        router.push("/workspace");
      } catch (err) {
        setError((err as Error).message);
        console.error("Login failed:", err);
      }
    });
  };

  return (
      <div className="min-h-[65dvh] bg-[#fef9f2] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="p-6 bg-white shadow-sm">
            <h1 className="text-2xl font-semibold text-center mb-6 text-[#ff8a80]">
              Log in
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="pt-4 flex justify-center items-center">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-1/3 bg-[#ff8a80] hover:bg-[#ff8a80]/90 text-white rounded-3xl"
                >
                  {isPending ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
  );
}

