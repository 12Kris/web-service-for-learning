import { cn } from "@/lib/utils";

function PageHeader({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn("mt-6", className)} {...props}>
      <div className=" container-wrapper font-black text-4xl text-primary-foreground">
        {title}
      </div>
    </section>
  );
}

export { PageHeader };
