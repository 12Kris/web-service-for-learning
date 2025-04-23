import { PageHeader } from "@/components/ui/page-header";

export default async function HomePage() {
  return (
    <div>
          <div className="flex flex-col sm:flex-row justify-between md:mt-6 md:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-0 pt-0 md:pt-4 ">
          <PageHeader className="mt-0 mb-3 md:mb-0" title="Home" />
      
        </div>
    </div>
  );
}
