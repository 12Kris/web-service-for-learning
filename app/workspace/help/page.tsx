import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  BookOpen, 
  Filter, 
  PlusCircle, 
  HelpCircle 
} from "lucide-react";

export default function HelpPage() {
    const sections = [
      {
        id: 1,
        title: "Navigating the Workspace",
        content: "Learn how to navigate through different sections of the workspace and access your courses.",
        icon: LayoutDashboard,
      },
      {
        id: 2,
        title: "Main Features",
        content: "Discover the key features that will help you make the most of your learning experience.",
        icon: BookOpen,
      },
      {
        id: 3,
        title: "Using Filters",
        content: "Learn how to use filters to find exactly what you&apos;re looking for in your courses.",
        icon: Filter,
      },
      {
        id: 4,
        title: "Creating a Course",
        content: "Step-by-step guide on how to create and manage your own courses.",
        icon: PlusCircle,
      },
      {
        id: 5,
        title: "Further Assistance",
        content: "Need more help? Here&apos;s how to get in touch with our support team.",
        icon: HelpCircle,
      },
    ];
  
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[--neutral] mb-4">Help & User Guide</h1>
          <p className="text-lg text-[--neutral] max-w-2xl mx-auto">
            Welcome to our help center. Here you&apos;ll find everything you need to know about using our platform effectively.
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
                    <CardTitle className="text-2xl font-semibold text-[--neutral] mb-4">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-[--neutral] text-lg">{section.content}</p>
                  </CardContent>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-[#e0f2e9] flex items-center justify-center">
                      <section.icon className="w-16 h-16 text-[--neutral]" />
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
  