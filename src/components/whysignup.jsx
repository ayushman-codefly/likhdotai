import { Badge } from "@/components/ui/badge";
import {
    Star,
    Users,
    Globe,
    CheckCircle,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import Link from "next/link";

const benefits = [
    {
        icon: Star,
        text: "First 3 Months Free – limited time offer for all early users",
    },
    {
        icon: Users,
        text: "Partner Discounts – special rates for DTP teams, publishers & media houses",
    },
    {
        icon: Globe,
        text: "Influence Our Roadmap – your feedback matters, help shape future features",
    },
    {
        icon: CheckCircle,
        text: "Lock in Early Pricing – ₹5000/year regular pricing after free period",
    },
];

export default function WhySignUpSection() {
    return (
        <section className="section">
            <div className="content">
                <div className="mt-20 bg-white flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="text-left flex flex-col md:flex-row items-center justify-between pt-20 gap-8">

                            {/* Left Content */}
                            <div className="w-full md:w-1/2 flex flex-col gap-6">
                                <Badge className="bg-blue-100 text-blue-800 w-max">
                                   <Sparkles/> Limited Time Offer
                                </Badge>

                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                    Why You Should Sign Up Today
                                </h2>
                                <div
                                    className={`flex flex-col gap-4 justify-center items-start my-6 transition-all duration-1000 delay-500 transform`}
                                >
                                    <Link
                                      href="/signup"
                                        size="lg"
                                        className=" w-max text-nowrap flex flex-row items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    >
                                        Join Free for 3 months
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <p className="text-sm text-slate-500">No payment. No pressure. Just pure typing magic.</p>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="w-full md:w-1/2 p-4">
                                <div className="mt-6 space-y-4">
                                    {benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-start space-x-3">
                                            <benefit.icon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                                            <p className="text-slate-600">{benefit.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
