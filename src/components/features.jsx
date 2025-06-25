import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle } from "lucide-react";

export const features = [
    {
        title: "Phonetic Typing",
        header: "Type as You Speak",
        description: "Easily type in Hindi, Oriya, or Bangla using familiar English spellings with smart phonetic conversion.",
        bullets: [
            "No need to learn native keyboard layouts",
            "Converts English input to native script instantly",
            "Makes typing accessible for all age groups",
        ],
        image: "/images/phonetic.png",
    },
    {
        title: "Inscript Typing",
        header: "Master Native Layouts",
        description: "Supports standard Inscript layouts for Hindi, Oriya, and Bangla—perfect for experienced users and formal documentation.",
        bullets: [
            "Follows government-approved typing standards",
            "Ideal for professional and official use",
            "Compatible with existing typing training",
            "Familiar for certified typists and exam aspirants",
        ],
        image: "/images/inscript.png",
    },
    {
        title: "Smart Spell Checker",
        header: "Catch Mistakes Instantly",
        description: "Detects and corrects spelling errors in Hindi, Oriya, and Bangla with context-aware suggestions in real-time.",
        bullets: [
            "Real-time correction as you type",
            "Understands phonetic and script-based errors",
            "Boosts accuracy in professional content",
            "Learns from usage to improve suggestions",
        ],
        image: "/images/spellchecker.png",
    },
    {
        title: "Indic Grammar Checker",
        header: "Write with Confidence",
        description: "Automatically checks grammar and sentence structure in Indic languages, offering intelligent suggestions for clearer writing.",
        bullets: [
            "Flags grammatical errors as you type",
            "Suggests proper sentence construction",
            "Supports better language learning",
            "Enhances the quality of your writing",
        ],
        image: "/images/grammar.png",
    },
    {
        title: "Humanized Translations",
        header: "Natural-Looking Translations",
        description: "Provides more natural and human-sounding translations between English and Indic languages—beyond robotic literal output.",
        bullets: [
            "Context-aware translation output",
            "Avoids stiff, word-for-word results",
            "Great for social media or creative use",
            "Feels natural to native readers",
        ],
        image: "/images/translation.png",
    },
    {
        title: "Speech to Text",
        header: "Speak to Type Instantly",
        description: "Convert spoken Hindi, Oriya, or Bangla into written text—fast, accurate, and ideal for multitasking or accessibility.",
        bullets: [
            "Speak instead of typing",
            "Fast dictation for notes or ideas",
            "Useful for users with limited mobility",
            "High accuracy even in regional accents",
        ],
        image: "/images/speechtotext.png",
    },
];

const FeatureSection = () => {
    return (
        <>
            {features.map((feature, index) => (
                <section key={index} id="features" className="section">
                    <div className="content mt-15">
                        <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="relative min-h-screen text-left flex flex-col gap-4 items-start justify-start pt-20">
                                <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    {feature.title}
                                </Badge>

                                <div className="w-full flex flex-col md:flex-row">
                                    {/* {
                                        index % 2 === 0 ? <>
                                            <div className="w-1/2 p-4 flex flex-col gap-4">
                                                <h3
                                                    className={`text-3xl sm:text-4xl lg:text-5xl leading-[1.5] font-bold mb-6 transition-all duration-1000 transform`}
                                                >
                                                    <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                                        {feature.header}
                                                    </span>
                                                </h3>
                                                <p className="text-lg text-slate-600 mb-6">
                                                    {feature.description}
                                                </p>
                                                <div>
                                                    <p className="text-lg text-slate-900 font-semibold mb-8">
                                                        How it <span className="text-orange-600">helps</span> in typing?
                                                    </p>
                                                    <div className="space-y-4">
                                                        {feature.bullets.map((point, idx) => (
                                                            <div key={idx} className="flex items-start space-x-3">
                                                                <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                                                <p className="text-slate-600">{point}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-1/2 p-4">
                                                <img src={feature.image} className="w-full bg-black" alt={feature.title} />
                                            </div>
                                        </> :
                                            <>
                                                <div className="w-1/2 p-4">
                                                    <img src={feature.image} className="w-full bg-black" alt={feature.title} />
                                                </div>
                                                <div className="w-1/2 p-4 flex flex-col gap-4">
                                                    <h3
                                                        className={`text-3xl sm:text-4xl lg:text-5xl leading-[1.5] font-bold mb-6 transition-all duration-1000 transform`}
                                                    >
                                                        <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                                            {feature.header}
                                                        </span>
                                                    </h3>
                                                    <p className="text-lg text-slate-600 mb-6">
                                                        {feature.description}
                                                    </p>
                                                    <div>
                                                        <p className="text-lg text-slate-900 font-semibold mb-8">
                                                            How it <span className="text-orange-600">helps</span> in typing?
                                                        </p>
                                                        <div className="space-y-4">
                                                            {feature.bullets.map((point, idx) => (
                                                                <div key={idx} className="flex items-start space-x-3">
                                                                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                                                    <p className="text-slate-600">{point}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                    } */}
                                    <div className="w-full md:w-1/2 p-4 flex flex-col gap-4">
                                        <h3
                                            className={`text-2xl sm:text-3xl lg:text-4xl leading-[1.5] font-bold mb-6 transition-all duration-1000 transform`}
                                        >
                                            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                                {feature.header}
                                            </span>
                                        </h3>
                                        <p className="text-lg text-slate-600 mb-6">
                                            {feature.description}
                                        </p>
                                        <div>
                                            <p className="text-lg text-slate-900 font-semibold mb-8">
                                                How it <span className="text-orange-600">helps</span> in typing?
                                            </p>
                                            <div className="space-y-4">
                                                {feature.bullets.map((point, idx) => (
                                                    <div key={idx} className="flex items-start space-x-3">
                                                        <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <p className="text-slate-600">{point}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 p-4">
                                        <img src={feature.image} className="w-full bg-black" alt={feature.title} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </>
    );
};

export default FeatureSection;
