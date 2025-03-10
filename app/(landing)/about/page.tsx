import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="text-xl">
        We are a company dedicated to innovation and excellence in our field.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To provide cutting-edge solutions that improve peoples lives and
              businesses.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To be the leading innovator in our industry, setting new standards
              for quality and customer satisfaction.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-8">Our Team</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {["Isaienko Volodymyr", "Virt Mykhailo", "Mamchur Chrystyna", "Bikbulatov Bogdan", "Mykhailo Nyskohuz", "Novikova Yana", "Dubas Roman"]
        .map((name) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Welcome! I am the part of Memoria team</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
