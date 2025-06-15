"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import {
    Users,
    Heart,
    Lightbulb,
    Target,
    Coffee,
    Code,
    Palette,
    MessageCircle,
    ArrowLeft,
    Mail,
    Bell,
    Rocket,
    Building,
    Globe,
    Type,
    CheckCircle,
    Terminal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
const CareersPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const values = [
        {
            icon: Heart,
            title: "Build for Bharat",
            description: "We're passionate about empowering Indian language professionals with cutting-edge technology."
        },
        {
            icon: Lightbulb,
            title: "Innovation First",
            description: "We challenge the status quo and build solutions that didn't exist before."
        },
        {
            icon: Users,
            title: "Team Spirit",
            description: "We believe in collaboration, mutual respect, and growing together as a team."
        },
        {
            icon: Target,
            title: "Impact Driven",
            description: "Every line of code, every design decision, every feature is built to make a real difference."
        }
    ];

    const futureRoles = [
        {
            category: "Engineering",
            icon: Code,
            roles: ["C# .NET Developer", "AI/ML Engineer", "Backend Developer"]
        },
        {
            category: "Design",
            icon: Palette,
            roles: ["UI/UX Designer", "Product Designer", "Graphics Designer"]
        },
        {
            category: "Product",
            icon: Target,
            roles: ["Product Manager", "Technical Writer", "QA Engineer"]
        },
        {
            category: "Growth",
            icon: Rocket,
            roles: ["Marketing Manager", "Community Manager", "Sales Associate"]
        }
    ];

    const handleNotifySubmit = () => {
        if (email) {
            // Handle email submission here
            toast("Event has been created", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            })
        }
        else {
            toast("Event has been created sdsd", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            })

        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-lime-100">
            {/* Navigation */}


            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-lime-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900" onClick={() => router.push("/")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                            <div className="w-px h-6 bg-slate-300" />
                            <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold bg-gradient-to-r from-lime-600 to-lime-700 bg-clip-text text-transparent">
                                    Likh.AI
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#values" className="text-slate-600 hover:text-slate-900 transition-colors">Culture</a>
                            <a href="#future-roles" className="text-slate-600 hover:text-slate-900 transition-colors">Future Roles</a>
                            <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700">
                                Get Notified
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
                            <Building className="w-4 h-4 mr-1" />
                            Join Our Mission
                        </Badge>

                        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}>
                            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                Build the Future of
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-lime-500 via-lime-600 to-lime-700 bg-clip-text text-transparent">
                                Indian Language Tech
                            </span>
                        </h1>

                        <p className={`text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}>
                            We're building the smartest typing assistant for India's language professionals.
                            <span className="text-lime-600 font-semibold"> Join us in revolutionizing</span> how Bharat writes, types, and creates.
                        </p>

                        {/* Current Status */}
                        <div className={`bg-white border border-lime-200 rounded-2xl p-8 max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}>
                            <div className="flex items-center justify-center mb-4">
                                <Coffee className="w-8 h-8 text-lime-500 mr-3" />
                                <h2 className="text-2xl font-bold text-slate-900">We're Still Building</h2>
                            </div>
                            <p className="text-lg text-slate-600 mb-6">
                                No current positions are open, but we're growing fast. We'll be hiring soon for exciting roles across engineering, design, product, and growth.
                            </p>
                            <Badge className="bg-lime-100 text-lime-800 px-4 py-2 text-base">
                                <Bell className="w-4 h-4 mr-2" />
                                Get notified when we start hiring
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section id="values" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-lime-100 text-lime-800 border-lime-300">Our Culture</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            What Drives Us Every Day
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            At Likh.AI, we're not just building software — we're crafting the future of how India communicates in its native languages.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {values.map((value, index) => (
                            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-lime-50 to-lime-100">
                                <CardContent className="p-8">
                                    <value.icon className="w-12 h-12 text-lime-500 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                    <p className="text-slate-600">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet the Team */}
            {/* <section className="py-20 bg-gradient-to-br from-lime-150 to-lime-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-lime-200 text-lime-800 border-lime-300">The Founding Team</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            You'll Be Working With
                        </h2>
                        <p className="text-lg text-slate-600">
                            Meet the passionate founders building Likh.AI from the ground up
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            { name: "AGENT1", role: "Co-founder & CEO", initials: "JB", bio: "Visionary leader with deep understanding of Indian language markets" },
                            { name: "", role: "Co-founder & CPO", initials: "AB", bio: "Product strategist focused on user-centered design and experience" },
                            { name: "", role: "Co-founder & CTO", initials: "AM", bio: "Technical architect building scalable AI-powered solutions" }
                        ].map((member, index) => (
                            <Card key={index} className="border-0 shadow-lg text-center bg-gradient-to-r from-lime-50 to-lime-100">
                                <CardContent className="p-6">
                                    <Avatar className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-lime-400 to-lime-600">
                                        <AvatarFallback className="text-white text-xl font-bold">
                                            {member.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                                    <p className="text-lime-600 font-semibold mb-3">{member.role}</p>
                                    <p className="text-slate-600 text-sm">{member.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Future Roles */}
            <section id="future-roles" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-lime-100 text-lime-800 border-lime-300">Coming Soon</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            Roles We'll Be Hiring For
                        </h2>
                        <p className="text-lg text-slate-600">
                            As we grow, we'll be looking for talented individuals across multiple disciplines
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {futureRoles.map((value, index) => (
                            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-lime-50 to-lime-100">
                                <CardHeader className="py-0">
                                    <div className="flex flex-row items-center gap-4">
                                        <value.icon className="w-12 h-12 text-lime-500 mb-4" />
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{value.category}</h3>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-8">
                                    {value.roles.map((role, roleIndex) => (
                                        <p key={roleIndex} className="text-slate-600">{role}</p>
                                    ))}

                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Notify Me Section */}
            <section className="py-20 bg-gradient-to-r from-lime-100 via-lime-150 to-lime-200 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Rocket className="w-16 h-16 mx-auto mb-6 opacity-90 text-lime-500" />
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900">
                        Be the First to Know
                    </h2>
                    <p className="text-xl mb-8 opacity-90 text-slate-900">
                        Get notified when we start hiring. Be part of the team that's revolutionizing Indian language technology.
                    </p>

                    <div className="max-w-md mx-auto">
                        <div className="flex gap-3 items-center">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg text-slate-900 ring-1 ring-lime-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-300"
                            />
                            <Button onClick={handleNotifySubmit} className="bg-white text-lime-600 hover:bg-lime-50 px-6 py-3 rounded-lg font-semibold">
                                <Bell className="w-4 h-4 mr-2" />
                                Notify Me
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm opacity-80 text-slate-900">
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            No spam, ever
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Unsubscribe anytime
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Early access opportunities
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Work With Us */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            Why Join Likh.AI?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Globe,
                                title: "Massive Impact",
                                description: "Your work will directly impact millions of Indian language users across industries."
                            },
                            {
                                icon: Rocket,
                                title: "Ground Floor Opportunity",
                                description: "Join us early and help shape the product, culture, and future of the company."
                            },
                            {
                                icon: Heart,
                                title: "Purpose-Driven Mission",
                                description: "Work on something meaningful that preserves and promotes India's linguistic diversity."
                            }
                        ].map((reason, index) => (
                            <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-lime-150 to-lime-200">
                                <CardContent className="p-8">
                                    <reason.icon className="w-12 h-12 text-lime-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-lime-50 mb-3 text-slate-900">{reason.title}</h3>
                                    <p className="text-lime-600">{reason.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <span className="text-xl font-bold">Likh.AI</span>
                        </div>
                        <div className="flex space-x-6 mb-4 md:mb-0">
                            <a href="/about" className="text-slate-400 hover:text-white transition-colors">About</a>
                            <a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
                            <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
                            <a href="/" className="text-slate-400 hover:text-white transition-colors">Home</a>
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

export default CareersPage;