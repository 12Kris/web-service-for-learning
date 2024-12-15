import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Step 1: Discovery",
      content: "We begin by understanding your needs and goals.",
    },
    {
      title: "Step 2: Planning",
      content:
        "Our team develops a comprehensive strategy tailored to your objectives.",
    },
    {
      title: "Step 3: Execution",
      content: "We implement the plan with precision and attention to detail.",
    },
    {
      title: "Step 4: Evaluation",
      content:
        "We measure results and make data-driven adjustments for optimal outcomes.",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">How It Works</h1>
      <p className="text-xl">
        Our process is designed to deliver the best results for our clients.
        Here is how we do it:
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{step.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Why Our Process Works</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Our approach combines industry best practices with innovative
            techniques, ensuring that we deliver consistent, high-quality
            results for every project. By following this structured process, we
            minimize risks and maximize efficiency, leading to successful
            outcomes for our clients.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
