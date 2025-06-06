"use client";

import { useState, useTransition, useEffect } from "react";
import { login } from "./actions";
import { getUser } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";

import { signInWithProvider } from "@/lib/auth/oauth";

import LoadingSpinner from "@/components/ui/loading-spinner";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  useEffect(() => {
    const checkSession = async () => {
      const userdata = await getUser();
      if (userdata) {
        router.push("/workspace");
      } else {
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // in LoginPage.tsx
startTransition(async () => {
  const formdata = new FormData();
  formdata.append("email", formData.email);
  formdata.append("password", formData.password);

  const result = await login(formdata);

  if (!result.success) {
    setError(result.error ?? "An unknown error occurred. Please try again.");
    return;
  }

  // this is the only redirect
  router.push("/workspace");
});
  };

  if (isLoggedIn === null) {
    return <LoadingSpinner className="mx-auto" />;
  }

  return (
    <div className="min-h-[65dvh] bg-[--background] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-6 bg-[--background] border-0 shadow-[0_0_30px_rgba(255,138,128,0.3)]">
          <h1 className="text-2xl font-semibold text-center mb-6 text-[#ff8a80]">
            Log In
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#517970]" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ fontSize: "16px" }}
                className="pl-10 border-[#517970] focus-visible:ring-[#517970]"
                icon={<Mail className="h-5 w-5 text-[#517970]" />}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#517970]" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ fontSize: "16px" }}
                className="pl-10 pr-10 border-[#517970] focus-visible:ring-[#517970]"
                icon={<Lock className="h-5 w-5 text-[#517970]" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#517970] z-10"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-[#ff8a80] data-[state=checked]:bg-[#ff8a80] data-[state=checked]:text-white ml-1"
              />
              <label htmlFor="rememberMe" className="text-sm text-[#517970]">
                Remember me
              </label>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-center items-center">
              <Button
                type="submit"
                disabled={isPending}
                variant={"accent"}
                size={"wide"}
              >
                {isPending ? "Logging in..." : "Log In"}
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#FFFAF4] text-gray-500">
                  Or log in via
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => signInWithProvider("google")}
                type="button"
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#517970]"
              >
                <FaGoogle
                  className="w-6 h-6"
                  style={{ color: "rgba(81, 121, 112, 1)" }}
                />
              </button>
              <button
                onClick={() => signInWithProvider("facebook")}
                type="button"
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#517970]"
              >
                <FaFacebook
                  className="w-6 h-6"
                  style={{ color: "rgba(81, 121, 112, 1)" }}
                />
              </button>
              <button
                onClick={() => signInWithProvider("twitter")}
                type="button"
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#517970]"
              >
                <FaTwitter
                  className="w-6 h-6"
                  style={{ color: "rgba(81, 121, 112, 1)" }}
                />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}