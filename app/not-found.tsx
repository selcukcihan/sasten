import { Button } from "../components/ui/button"
import Link from "next/link"

export default async function NotFound() {

  return (
    <div className="lg:flex lg:flex-col lg:h-screen">
      <div className="flex flex-col min-h-svh lg:min-h-fit lg:h-full">
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-8 flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-gray-900 dark:text-white shadow-lg rounded-lg w-full max-w-3xl p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {`Looks like there's no such page :(`}
            </p>
            <Link href={'/'}>
              <Button variant="outline" className="mt-4">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
