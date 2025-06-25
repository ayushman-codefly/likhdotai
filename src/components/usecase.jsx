import {
    FileText,
    Building,
    School,
    Mic,
    BookOpenCheck,
    Languages,
    Globe,
    PenTool,
    CheckCircle,
    Sparkle,
    Sparkles,
} from "lucide-react";
import { Badge } from "./ui/badge";

// Optional: Create array of use cases with icon components
const useCases = [
    {
        icon: FileText,
        label: "Content creators write faster with phonetic tools.",
    },
    {
        icon: Building,
        label: "Government offices use native-script support like Inscript.",
    },
    {
        icon: School,
        label: "Teachers and students benefit from spell and grammar help.",
    },
    {
        icon: Mic,
        label: "Journalists dictate stories using Speech to Text.",
    },
    {
        icon: BookOpenCheck,
        label: "Editors and proofreaders rely on smart corrections.",
    },
    {
        icon: Languages,
        label: "Translators get natural, contextual translations.",
    },
    {
        icon: Globe,
        label: "Developers integrate multilingual typing into apps.",
    },
    {
        icon: PenTool,
        label: "Designers add native text to visuals easily.",
    },
];

export default function WhoWeServeSection() {
    return (
        <section className="section">
            <div className="content">
                <div className="min-h-screen bg-white flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="text-left flex flex-col md:flex-row items-center justify-between pt-20 gap-8">

                            {/* Left Content */}
                            <div className="w-full md:w-1/2 p-4">
                                <div className="mt-6 space-y-4">
                                    {useCases.map((item, idx) => (
                                        <div key={idx} className="flex items-start space-x-3">
                                            <item.icon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                                            <p className="text-slate-600">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            
                            {/* Right Content */}
                            <div className="w-full md:w-1/2 flex flex-col gap-6">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-300 w-max">
                                   <Sparkles/> Who We Serve
                                </Badge>

                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                    Perfect for every Indian language professional
                                </h2>

                                <p className="text-lg text-slate-600">
                                    From content creators to government offices, Likh.AI empowers professionals across industries to
                                    type faster, smarter, and more accurately in Indian languages.
                                </p>
                            </div>

                            

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
