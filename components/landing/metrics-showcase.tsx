import Image from "next/image"

interface Metric {
  value: string
  label: string
  hasStar?: boolean
}

interface MetricsShowcaseProps {
  title: string
  metrics: Metric[]
}

export function MetricsShowcase({ title, metrics }: MetricsShowcaseProps) {
  return (
    <section className="w-full bg-[#e8f5eb] py-16 ">
      <div className="container mx-auto px-4 md:flex flex-col md:justify-around md:flex-row items-center">
        <h2 className="mb-12 md:w-1/3 text-center text-3xl font-medium text-[--neutral] md:text-4xl md:mb-0 md:text-left">
          {title}
        </h2>
        <div className="flex flex-col md:flex-row gap-9 ">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center md:w-fit ">
              <div className="mb-2 flex items-center justify-center md:w-fit gap-2">
                <span className="text-4xl font-bold text-[--neutral] md:text-5xl mr-2">
                  {metric.value}
                </span>
                {metric.hasStar && (
                  <Image src="/star.svg" alt="Star" width={40} height={40} />
                )}
              </div>
              <p className="text-lg mt-2 text-[--neutral]">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

