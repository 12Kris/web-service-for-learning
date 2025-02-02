"use client";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { alreadyConfirmed } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [error, setError] = useState("");

  let email: string, password: string;

  if (token) {
    try {
      const decoded = jwtDecode<{ email: string; password: string }>(token);

      email = decoded.email;
      password = decoded.password;
    } catch (err) {
      setError(`Invalid token ${err}`);
    }
  } else {
    return <p>Token not found in URL</p>;
  }

  const alreadyConfirmedHandler = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    if (!email || !password) {
      console.error("Missing login or password");
      setError("Missing login or password in token");
      return;
    }
    const result = await alreadyConfirmed(email, password);
    console.log(result);
    if (result.error == null) {
      router.push("/workspace");
    } else {
      setError(result.error);
    }
  };

  return (
    <main className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Confirm Your Email</CardTitle>
          <CardDescription>
            We have sent a confirmation link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Please check your inbox and click on the link to confirm your email
            address. If you do not see the email, check your spam folder.
          </p>
        </CardContent>
        {error && (
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        )}

        <CardFooter>
          {/* <form action={resendConfirmationEmail}>
            <Button type="submit">Resend Confirmation Email</Button>
          </form> */}

          <form onSubmit={alreadyConfirmedHandler}>
            <Button type="submit">Already confirmed</Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}
