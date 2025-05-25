"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Mic, 
  Zap, 
  Globe, 
  Users, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Play,
  Sparkles,
  Brain,
  Type,
  Languages,
  Heart,
  Calendar,
  Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const LikhAILanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const router = useRouter();
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Type, title: "Smart Typing", desc: "Any layout, any font" },
    { icon: Mic, title: "Voice Input", desc: "Speak in Indian languages" },
    { icon: Brain, title: "AI Assistant", desc: "Grammar & tone correction" }
  ];

  const mockups = [
    { title: "Clean Interface", gradient: "from-blue-500 to-purple-600" },
    { title: "Voice Input", gradient: "from-green-500 to-blue-500" },
    { title: "Smart Suggestions", gradient: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-lime-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-lime-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-lime-600 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-white" />
              </div> */}
              <span className="text-xl font-bold bg-gradient-to-r from-lime-600 to-lime-700 bg-clip-text text-transparent">
                Likh.AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#team" className="text-slate-600 hover:text-slate-900 transition-colors">Team</a>
              <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700" onClick={() => router.push("/signup")}>
                Join Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-lime-50 to-lime-100 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-lime-100 to-lime-200 text-lime-800 border-lime-300">
              <Sparkles className="w-4 h-4 mr-1" />
              Get 6 Months FREE – then just ₹5000/year
            </Badge>
            
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Likho with
              </span>
              <br />
              <span className="bg-gradient-to-r from-lime-500 via-lime-600 to-lime-700 bg-clip-text text-transparent">
                Likh.AI
              </span>
            </h1>
            
            <p className={`text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              Your always-on Indian language typing assistant. Type effortlessly in 
              <span className="text-lime-600 font-semibold"> Hindi, Bangla, Odia & more</span> — 
              with voice typing, smart suggestions, and instant grammar help.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-1000 delay-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Button size="lg" className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                Join Free for 1 Year
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-slate-500">No payment. No pressure. Just pure typing magic.</p>
            </div>

            {/* Animated Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className={`border-0 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-lime-300 transition-all duration-500 transform hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white to-lime-50 bg-white
                `}>
                  <CardContent className="p-6 text-center">
                    <feature.icon className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
                      currentFeature === index ? 'text-lime-500' : 'text-slate-400'
                    }`} />
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800">Our Mission</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                India types. A lot. But we're still stuck using tools from the 90s.
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                DTP operators, publishing houses, printing presses, and broadcasters are all using outdated, offline software. 
                It's slow, clunky, and built for another era.
              </p>
              <p className="text-lg text-slate-900 font-semibold mb-8">
                <span className="text-orange-600">Likh.AI</span> is here to change that.
              </p>
              <div className="space-y-4">
                {[
                  "Eliminate the hassles of typing in Indian scripts",
                  "Enhance accuracy with smart AI-powered assistance", 
                  "Deliver a seamless user experience that works across tools"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Languages className="w-24 h-24 text-lime-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Made for India</h3>
                  <p className="text-slate-600">Proudly built for Indian language professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="py-20 bg-gradient-to-br from-lime-50 to-lime-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-lime-100 text-lime-800 border-lime-300">What We're Building</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Features that make typing effortless
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-lime-500" />
                  <span>Start Smart</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Type in any layout: Inscript, Modular, Phonetic",
                  "Fonts that work: Unicode + Non-Unicode", 
                  "Integrates with Word, CorelDRAW, InDesign, Photoshop",
                  "Spelling & word suggestions, real-time help"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-lime-400 rounded-full" />
                    <p className="text-slate-600">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-lime-600" />
                  <span>Get Smarter</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Voice typing that works in Indian languages",
                  "Grammar correction made for print quality",
                  "AI that completes sentences, corrects tone",
                  "Speeds up your work across all platforms"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-lime-500 rounded-full" />
                    <p className="text-slate-600">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Visual Mockups */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Sneak Peek</h3>
            <p className="text-slate-600 mb-8">Here's a glimpse at what it'll feel like:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockups.map((mockup, index) => (
              <Card key={index} className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`h-48 bg-gradient-to-br ${mockup.gradient} relative flex items-center justify-center`}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white text-center">
                    <Play className="w-8 h-8 mx-auto mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <p className="font-semibold">Preview</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-slate-900">{mockup.title}</h4>
                  <p className="text-sm text-slate-600">Interactive mockup coming soon</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sign Up */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">Limited Time Offer</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Why You Should Sign Up Today
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Star, title: "First 6 Months Free", desc: "Limited time offer for all early users" },
              { icon: Users, title: "Partner Discounts", desc: "Special rates for DTP teams, publishers & media houses" },
              { icon: Globe, title: "Influence Our Roadmap", desc: "Your feedback matters — help us build what you need" },
              { icon: CheckCircle, title: "Lock in Early Pricing", desc: "₹5000/year regular pricing after free period" }
            ].map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-lime-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-100 mb-2">{benefit.title}</h3>
                  <p className="text-lime-700 text-sm">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-slate-600 mb-6">
              "If you've ever used ShreeLipi, you'll love this upgrade."
            </p>
            <Button size="lg" className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 text-lg rounded-full">
              Join the Movement
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Meet the Team</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              The founders behind Likh.AI
            </h2>
            <p className="text-lg text-slate-600">
              Building for the people who power India's language industries — one keystroke at a time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Janajit Bagchi", role: "Co-founder & CEO", initials: "JB" },
              { name: "Anurag Behera", role: "Co-founder & CPO", initials: "AB" },
              { name: "Ayushman Manishankar", role: "Co-founder & CTO", initials: "AM" }
            ].map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6 flex flex-col justify-between items-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-pink-500">
                    <AvatarFallback className="text-white text-xl font-bold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-lime-50 mb-1 w-max">{member.name}</h3>
                  <p className="text-lime-300">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            We're going live soon!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be the first to experience India's smartest typing assistant.
            Join the early access list — and be part of the writing revolution.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <p className="text-2xl font-bold mb-2">6 months free</p>
            <p className="opacity-90">then just ₹5000/year per license</p>
          </div>
          <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg rounded-full shadow-lg" onClick={() => router.push("/signup")}>
            <Mail className="w-5 h-5 mr-2" />
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">Likh.AI</span>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="/about" className="text-slate-400 hover:text-white transition-colors">About</a>
              <a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
              <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</a>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <p>© 2025 Likh.AI — Made with</p>
              <Heart className="w-4 h-4 text-red-500" />
              <p>for Indian languages</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LikhAILanding;