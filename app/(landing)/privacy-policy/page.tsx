import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Database, 
  Settings, 
  UserCheck 
} from "lucide-react";

export default function PrivacyPolicy() {
    const sections = [
      {
        id: 1,
        title: "Introduction",
        content:
          "We value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.",
        icon: Shield,
      },
      {
        id: 2,
        title: "Data Collection",
        content:
          "We collect personal data such as name, email, and course preferences to improve your learning experience.",
        icon: Database,
      },
      {
        id: 3,
        title: "How We Use Your Data",
        content:
          "Your data helps us personalize content, recommend courses, and improve our platform's functionality.",
        icon: Settings,
      },
      {
        id: 4,
        title: "Your Rights",
        content:
          "You have the right to access, modify, or delete your personal data. Contact us if you need assistance.",
        icon: UserCheck,
      },
    ];
  
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#5c7d73] mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
  