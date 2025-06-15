import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Pin, Star, Truck, Shield, Heart } from "lucide-react";
import Mug3D from "@/components/Mug3D";

const Landing = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="w-full shadow-sm z-30 flex-none">
        <nav className="flex items-center px-8 py-4 bg-white border-b">
          <Pin className="mr-3 text-primary" size={32} />
          <span className="text-2xl font-extrabold tracking-wide mr-12 text-gray-900 select-none">
            LovablePrint Mugs
          </span>
          <div className="ml-auto flex gap-2">
            <Link to="/design-editor">
              <Button variant="outline" className="mr-2">
                Design Editor
              </Button>
            </Link>
            <Link to="/editor">
              <Button variant="outline" className="mr-4">
                Simple Editor
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Personalised Mugs
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Printed Mugs that bring smiles every day!
              </p>
              <ul className="space-y-4 mb-8 text-gray-700">
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                  Personalise with photos, logo and more with Sharp, high-quality photo printing
                </li>
                <li className="flex items-start">
                  <Heart className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  8 color options for handle and mug interior with 2-side and wraparound print options available
                </li>
                <li className="flex items-start">
                  <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Food-grade quality for safe use. Microwave and Dishwasher friendly
                </li>
                <li className="flex items-start">
                  <Truck className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  Same Day Delivery available on select pin codes in Mumbai
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/design-editor">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg">
                    Upload Design
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                  Browse Designs
                </Button>
              </div>
            </div>

            {/* Right Content - Enhanced 3D Mug Model */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-4">
                <div className="w-full h-96 rounded-lg overflow-hidden">
                  <Mug3D />
                </div>
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold transform rotate-12">
                  Starting at ₹300
                </div>
                <div className="absolute -bottom-2 -left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Premium Quality
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Personalised Mugs?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                High-quality photo printing with food-grade materials for daily use
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Same day delivery available in Mumbai, free shipping on all orders
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Satisfaction</h3>
              <p className="text-gray-600">
                100% satisfaction guaranteed with easy returns and exchanges
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Create Your Perfect Mug?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Design your personalized mug in seconds — just like Vistaprint.
          </p>
          <Link to="/design-editor">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Start Designing Now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Pin className="mr-3 text-blue-400" size={24} />
            <span className="text-xl font-bold">LovablePrint Mugs</span>
          </div>
          <p className="text-gray-400">
            © 2024 LovablePrint Mugs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;