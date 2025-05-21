import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  Lock, 
  AlertCircle 
} from "lucide-react";

export default function TermsOfService() {
    const sections = [
      {
        id: 1,
        title: "Agreement to Terms",
        content:
          "By accessing and using our platform, you agree to be bound by these Terms of Service. Please read them carefully before proceeding.",
        icon: FileText,
      },
      {
        id: 2,
        title: "User Responsibilities",
        content:
          "Users must provide accurate information, maintain account security, and use the platform in accordance with our guidelines and applicable laws.",
        icon: Users,
      },
      {
        id: 3,
        title: "Intellectual Property",
        content:
          "All content, features, and functionality of our platform are owned by us and are protected by international copyright, trademark, and other intellectual property laws.",
        icon: Lock,
      },
      {
        id: 4,
        title: "Limitation of Liability",
        content:
          "We are not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.",
        icon: AlertCircle,
      },
    ];
  
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#5c7d73] mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These terms govern your use of our platform. By using our services, you agree to these terms.
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
  