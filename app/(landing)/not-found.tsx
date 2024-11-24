import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 mx-auto ">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold text-gray-900">404</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-xl font-semibold mb-2">Oops! Page not found</p>
          <p className="text-gray-600 mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="w-full max-w-xs mx-auto ">
            <Image
              src="/images/dead-folder.png"
              width={128}
              height={128}
              alt="404 Illustration"
              className="w-28 mx-auto mb-6"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}