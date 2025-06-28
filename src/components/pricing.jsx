"use client"

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

const plans = [
  {
    id: "free",
    title: "Starter Plan",
    badge: "Free for 3 Months",
    price: "₹0",
    after: "Then limited free usage",
    features: [
      "300 phonetic suggestions per day",
      "2000 characters for typing",
      "50 grammar corrections & spell checks",
      "Inscript typing support",
      "2 AI chats/day for content creation",
    ],
  },
  {
    id: "pro",
    title: "Pro Plan",
    badge: "Best Value",
    price: "₹5000/year",
    after: "Annual billing",
    features: [
      "Unlimited phonetic & Inscript typing",
      "Unlimited grammar corrections & spell checks",
      "10,000 translation characters/month",
      "1 hour of Dictation(Speech-to-Text) per month",
      "100 AI chats/month for content creation",
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise Plan",
    badge: "Custom Solutions",
    price: "Contact Us",
    after: "Tailored to your needs",
    features: [
      "Unlimited Dictation(Speech-to-Text)",
      "Unlimited machine translations",
      "Unlimited phonetic & Inscript usage",
      "Unlimited grammar & spell checks",
      "Unlimited AI content generation",
      "Priority support and integration help",
    ],
  },
];

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState("free");

  const activePlan = plans.find((plan) => plan.id === selectedPlan);

  return (
    <section className="section" id="pricing">
      <div className="content py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800"><Sparkles/> Pricing Plans</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Choose the plan that fits you
            </h2>
          </div>

          {/* Plan Toggle */}
          <div className="flex justify-center gap-2 mb-10">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all
                  ${selectedPlan === plan.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"}`}
              >
                {plan.title}
              </button>
            ))}
          </div>

          {/* Pricing Card */}
          {activePlan && (
            <div className="border-0 shadow-xl bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-8 text-left">
              <Badge className="mb-4 bg-white text-blue-800 border-blue-300"><Sparkles /> {activePlan.badge}</Badge>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{activePlan.title}</h3>
              <p className="text-3xl font-extrabold text-blue-700 mb-1">{activePlan.price}</p>
              <p className="text-sm text-slate-600 mb-6">{activePlan.after}</p>

              <div className="space-y-3 mb-6">
                {activePlan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    <p className="text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>

              {/* <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full py-2">
                {activePlan.id === "enterprise" ? "Contact Sales" : "Get Started"}
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
