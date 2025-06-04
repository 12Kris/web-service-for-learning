import Link from "next/link";

export default function Gradient() {
    return (
        <div className="h-[50vh] w-full relative bg-gradient-custom bg-[length:120%_120%] bg-[position:center_-80px] bg-no-repeat">
            <div className="relative flex flex-col items-center justify-center h-full text-center px-4 md:px-6 lg:px-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[--neutral] max-w-3xl mb-6">
                    Discover, Learn, Grow:{" "}
                    <span className="block mt-2">Master New Skills for Tomorrow</span>
                </h1>

                <p className="text-slate-600 mb-8 max-w-xl">
                    Your journey to new skills and brighter opportunities begins here.
                </p>

                <button className="px-6 py-3 bg-[#ff7b7b] hover:bg-[#ff6b6b] transition-colors text-white rounded-full font-medium">
                    <Link href={`/login`}>
                        Start learning today
                    </Link>
                </button>
            </div>
        </div>
    )
}

