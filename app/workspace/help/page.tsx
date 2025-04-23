export default function Help() {
    const sections = [
      {
        id: 1,
        title: "Navigating the Workspace",
        content:
          "The workspace consists of a sidebar for navigation and a main content area for browsing courses.",
        image: "/images/navigation.png",
      },
      {
        id: 2,
        title: "Main Features",
        content:
          "You can browse courses, bookmark them, and access helpful resources. Click on a course to view details.",
        image: "/images/features.png",
      },
      {
        id: 3,
        title: "Using Filters & Navigation",
        content:
          "Use the Filter button to sort courses based on your preferences. Navigate between pages using the provided arrows.",
        image: "/images/filters.png",
      },
      {
        id: 4,
        title: "Creating a Course",
        content:
          "Click the + Create New button at the top right. Fill in the course details, then submit.",
        image: "/images/create-course.png",
      },
      {
        id: 5,
        title: "Need Further Assistance?",
        content:
          "If you encounter any issues, visit the Contact Us page to get support.",
        image: "/images/support.png",
      },
    ];
  
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Help & User Guide</h1>
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
  