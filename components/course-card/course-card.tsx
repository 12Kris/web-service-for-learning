import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  title: string;
  topic: string;
  thermsCount: number;
  description: string;
  author: string;
}

export function CourseCard({
  title,
  topic,
  thermsCount,
  description,
  author,
}: CourseCardProps) {
  return (
    <Card className="w-full h-full flex flex-col justify-between ">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 ">
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{topic}</Badge>
          <p className="text-sm font-medium">{thermsCount} students</p>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-end">
          <Badge variant="outline">{author}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
