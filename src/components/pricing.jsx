"use client"

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Keyboard, PenTool } from "lucide-react";
import Link from "next/link";

const typingPlans = [
  {
    id: "typing-free",
    title: "Free",
    badge: "Basic Features",
    price: "₹0",
    period: "/month",
    features: [
      "Basic phonetic input",
      "Hindi-only support",
      "Offline access",
      "Limited daily usage",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "typing-pro",
    title: "Pro",
    badge: "Professional Use",
    price: "₹4,999",
    period: "/year",
    features: [
      "All languages support",
      "Voice input & dictation",
      "Advanced grammar checking",
      "Legacy tool integration",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "typing-enterprise",
    title: "Enterprise",
    badge: "Custom Solutions",
    price: "Custom",
    period: "Quote",
    features: [
      "Custom deployment",
      "Dedicated onboarding",
      "Team management",
      "Advanced analytics",
      "24/7 support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const writingPlans = [
  {
    id: "writing-free",
    title: "Free",
    badge: "Get Started",
    price: "₹0",
    period: "/month",
    features: [
      "Limited content generation",
      "Single-language support",
      "No voice training",
      "Basic templates only",
    ],
    benefits: [
      "Perfect for trying out the platform",
      "Get familiar with AI writing tools",
    ],
    cta: "Try Free",
    popular: false,
  },
  {
    id: "writing-pro",
    title: "Pro",
    badge: "Most Popular",
    price: "₹1,499",
    period: "/month",
    features: [
      "Writing style learning",
      "Multi-language support", 
      "SEO optimization tools",
      "Platform export options",
      "Advanced content templates",
      "Email & chat support",
    ],
    benefits: [
      "Learn your unique writing voice",
      "Generate content 5x faster",
      "Perfect for content creators & marketers",
    ],
    cta: "Start Pro",
    popular: true,
  },
  {
    id: "writing-team",
    title: "Team",
    badge: "For Teams",
    price: "₹1,999",
    period: "/month/member",
    features: [
      "Team collaboration tools",
      "Brand voice training",
      "Workflow approvals",
      "Advanced analytics & reporting",
      "Priority support & onboarding",
    ],
    benefits: [
      "Maintain brand consistency across team",
      "Streamline content approval workflows",
      "Scale content creation efficiently",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingSection() {
  const [selectedCategory, setSelectedCategory] = useState("writing");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = selectedCategory === "typing" ? typingPlans : writingPlans;

  const handlePlanAction = (plan) => {
    if (plan.cta === "Contact Sales") {
      return "/contact";
    } else if (plan.title === "Free") {
      return "/signup";
    } else {
      return "/signup";
    }
  };

  const handleCardClick = (plan) => {
    setSelectedPlan(plan.id);
  };

  return (
    <section className="section" id="pricing">
      <div className="content py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
              <Sparkles/> Pricing Plans
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Start with our free plans or upgrade for professional features. Both products designed for Indian content creators.
            </p>
          </div>

          {/* Category Toggle */}
          <div className="flex justify-center gap-2 mb-20">
            <button
              onClick={() => {
                setSelectedCategory("typing");
                setSelectedPlan(null);
              }}
              className={`px-6 py-3 rounded-full border font-medium transition-all flex items-center gap-2 ${
                selectedCategory === "typing"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              <Keyboard className="w-4 h-4" />
              Typing Assistant
            </button>
            <button
              onClick={() => {
                setSelectedCategory("writing");
                setSelectedPlan(null);
              }}
              className={`px-6 py-3 rounded-full border font-medium transition-all flex items-center gap-2 ${
                selectedCategory === "writing"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              <PenTool className="w-4 h-4" />
              Writing Assistant
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col cursor-pointer group ${
                  selectedPlan === plan.id
                    ? "border-2 border-blue-500 shadow-xl scale-102"
                    : plan.popular
                    ? "border-2 border-blue-300 shadow-xl hover:border-blue-500 hover:scale-102"
                    : "border border-gray-200 shadow-lg hover:shadow-xl hover:border-blue-300 hover:scale-102"
                } bg-white`}
                onClick={() => handleCardClick(plan)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${plan.title} plan for ${plan.price}${plan.period}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(plan);
                  }
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    ⭐ Most Popular
                  </div>
                )}
                
                {selectedPlan === plan.id && (
                  <div className="absolute -top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    ✓ Selected
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
                    {plan.badge}
                  </Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.title}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-slate-600 ml-1">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Features Included:</h4>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-700 text-sm">{feature}</p>
                      </div>
                    ))}
                  </div>

                  {/* Key Benefits */}
                  {plan.benefits && (
                    <>
                      <h4 className="font-semibold text-slate-900 mb-3">Key Benefits:</h4>
                      <div className="space-y-2">
                        {plan.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-600 text-sm font-medium">{benefit}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* CTA Button - Aligned at bottom */}
                <div className="mt-auto">
                  <Link href={handlePlanAction(plan)}>
                    <Button 
                      className={`w-full py-3 rounded-full font-medium transition-all group-hover:shadow-lg ${
                        selectedPlan === plan.id
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                          : plan.popular
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white group-hover:scale-102"
                          : "bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50 group-hover:border-blue-400 group-hover:scale-102"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-blue-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {selectedCategory === "writing" ? "Writing Assistant Benefits" : "Why Choose Our Typing Assistant?"}
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                {selectedCategory === "writing" ? (
                  <>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Learn Your Voice</p>
                        <p className="text-sm text-slate-600">Upload your content and let AI learn your unique writing style</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">5x Faster Content</p>
                        <p className="text-sm text-slate-600">Generate blogs, social posts, and marketing content in minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Multi-Platform Ready</p>
                        <p className="text-sm text-slate-600">Content optimized for different platforms and audiences</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Indian Language Support</p>
                        <p className="text-sm text-slate-600">Create content in Hindi, English, and other Indian languages</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Made for Indian Languages</p>
                        <p className="text-sm text-slate-600">Specialized for Hindi, Bengali, Oriya, and more regional languages</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Works Offline</p>
                        <p className="text-sm text-slate-600">Full functionality without internet connection</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Legacy Integration</p>
                        <p className="text-sm text-slate-600">Works with Word, Photoshop, InDesign, CorelDRAW</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Professional Grade</p>
                        <p className="text-sm text-slate-600">Trusted by DTP operators, publishers, and government offices</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
