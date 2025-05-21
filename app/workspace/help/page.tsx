import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  BookOpen, 
  Filter, 
  PlusCircle, 
  HelpCircle 
} from "lucide-react";

export default function Help() {
    const sections = [
      {
        id: 1,
        title: "Navigating the Workspace",
        content:
          "The workspace consists of a sidebar for navigation and a main content area for browsing courses.",
        icon: LayoutDashboard,
      },
      {
        id: 2,
        title: "Main Features",
        content:
          "You can browse courses, bookmark them, and access helpful resources. Click on a course to view details.",
        icon: BookOpen,
      },
      {
        id: 3,
        title: "Using Filters & Navigation",
        content:
          "Use the Filter button to sort courses based on your preferences. Navigate between pages using the provided arrows.",
        icon: Filter,
      },
      {
        id: 4,
        title: "Creating a Course",
        content:
          "Click the + Create New button at the top right. Fill in the course details, then submit.",
        icon: PlusCircle,
      },
      {
        id: 5,
        title: "Need Further Assistance?",
        content:
          "If you encounter any issues, visit the Contact Us page to get support.",
        icon: HelpCircle,
      },
    ];
  
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#5c7d73] mb-4">Help & User Guide</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to our help center. Here you'll find everything you need to know about using our platform effectively.
          </p>
        </div>
  
        <div className="grid gap-8">
          {sections.map((section, index) => (
            <Card key={section.id} className="overflow-hidden border-[#e0f2e9] bg-white/50 backdrop-blur-sm">
              <div className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center`}>
                <div className="md:w-1/2 p-8">
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-semibold text-[#5c7d73] mb-4">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-gray-600 text-lg">{section.content}</p>
                  </CardContent>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-[#e0f2e9] flex items-center justify-center">
                      <section.icon className="w-16 h-16 text-[#5c7d73]" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  