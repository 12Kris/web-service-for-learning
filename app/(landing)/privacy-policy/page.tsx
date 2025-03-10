export default function PrivacyPolicy() {
    const sections = [
      {
        id: 1,
        title: "Introduction",
        content:
          "We value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.",
        image: "/images/privacy-intro.png",
      },
      {
        id: 2,
        title: "Data Collection",
        content:
          "We collect personal data such as name, email, and course preferences to improve your learning experience.",
        image: "/images/data-collection.png",
      },
      {
        id: 3,
        title: "How We Use Your Data",
        content:
          "Your data helps us personalize content, recommend courses, and improve our platform's functionality.",
        image: "/images/data-usage.png",
      },
      {
        id: 4,
        title: "Your Rights",
        content:
          "You have the right to access, modify, or delete your personal data. Contact us if you need assistance.",
        image: "/images/your-rights.png",
      },
    ];
  
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <div className="space-y-12">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex flex-col md:flex-row items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="md:w-1/2 p-6">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="text-gray-600 mt-2">{section.content}</p>
              </div>
              {/* <div className="md:w-1/2">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div> */}
            </div>
          ))}
        </div>
      </div>
    );
  }
  