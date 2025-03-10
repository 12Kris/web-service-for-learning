import { Button } from "@/components/ui/button";

export default function ContactUs() {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-600">If you have any questions, feel free to reach out to us.</p>
        <form className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Name</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Your Name" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input type="email" className="w-full p-2 border rounded-md" placeholder="Your Email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Message</label>
            <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="Your Message"></textarea>
          </div>
          <Button type="submit" className="rounded-full font-bold items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--neutral] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 text-[--neutral] bg-transparent border-2 border-[--neutral] hover:text-white hover:bg-[--neutral] h-9 px-6 flex">Send</Button>
        </form>
      </div>
    );
  }
  