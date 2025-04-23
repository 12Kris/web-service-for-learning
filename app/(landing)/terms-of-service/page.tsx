export default function TermsOfService() {
    const sections = [
      {
        id: 1,
        title: "Agreement to Terms",
        content:
          "By using our platform, you agree to comply with our terms and conditions. Please read them carefully.",
        image: "/images/terms-agreement.png",
      },
      {
        id: 2,
        title: "User Responsibilities",
        content:
          "Users must provide accurate information and follow the guidelines while interacting with our courses and community.",
        image: "/images/user-responsibilities.png",
      },
      {
        id: 3,
        title: "Prohibited Activities",
        content:
          "Users are not allowed to engage in any illegal, harmful, or fraudulent activities on our platform.",
        image: "/images/prohibited-activities.png",
      },
      {
        id: 4,
        title: "Termination of Services",
        content:
          "We reserve the right to suspend or terminate accounts that violate our policies.",
        image: "/images/service-termination.png",
      },
    ];
  
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
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
            </div>
          ))}
        </div>
      </div>
    );
  }
  