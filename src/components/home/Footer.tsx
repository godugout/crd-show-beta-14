
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubscribing(true);
    
    // Simulate newsletter subscription
    setTimeout(() => {
      toast.success("Thanks for subscribing! You'll receive updates soon.");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <footer className="bg-[#141416] w-full py-16 px-6 max-w-7xl mx-auto max-md:px-5">
      <div className="flex flex-wrap justify-between gap-12 mb-12">
        <div className="flex flex-col gap-6 max-w-sm">
          <div className="flex gap-2 text-lg text-[#F4F5F6] font-black tracking-[-0.36px] leading-8">
            <img
              src="/lovable-uploads/cd4cf59d-5ff5-461d-92e9-61b6e2c63e2e.png"
              className="aspect-[1.34] object-contain w-[160px]"
              alt="CRD Logo"
            />
          </div>
          <div className="text-[#777E90] text-base">
            Create, collect, and showcase digital trading cards with stunning 3D effects and professional templates.
          </div>
          <div className="flex gap-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/ead2b833ecbb0d5e802c8121d38ad6f6fbd9caf6?placeholderIfAbsent=true"
              className="w-8 h-8"
              alt="Twitter"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/ebfc99b3e51af13b7b3acbcd4b0c344ed0a5c3f4?placeholderIfAbsent=true"
              className="w-8 h-8"
              alt="Instagram"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/8e7d98f4b2a4ce7c20d4b886499ed0aa22d39276?placeholderIfAbsent=true"
              className="w-8 h-8"
              alt="Facebook"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="text-[#FCFCFD] text-base font-semibold mb-2">Create</div>
          <div className="text-[#777E90] flex flex-col gap-3">
            <Link to="/create" className="hover:text-[#FCFCFD] transition-colors">Studio</Link>
            <Link to="/generator" className="hover:text-[#FCFCFD] transition-colors">Generator</Link>
            <Link to="/gallery" className="hover:text-[#FCFCFD] transition-colors">Templates</Link>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="text-[#FCFCFD] text-base font-semibold mb-2">Explore</div>
          <div className="text-[#777E90] flex flex-col gap-3">
            <Link to="/gallery" className="hover:text-[#FCFCFD] transition-colors">Gallery</Link>
            <Link to="/marketplace" className="hover:text-[#FCFCFD] transition-colors">Marketplace</Link>
            <Link to="/discover" className="hover:text-[#FCFCFD] transition-colors">Discover</Link>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="text-[#FCFCFD] text-base font-semibold mb-2">Platform</div>
          <div className="text-[#777E90] flex flex-col gap-3">
            <Link to="/about" className="hover:text-[#FCFCFD] transition-colors">About</Link>
            <Link to="/pricing" className="hover:text-[#FCFCFD] transition-colors">Pricing</Link>
            <Link to="/support" className="hover:text-[#FCFCFD] transition-colors">Support</Link>
          </div>
        </div>

        <div className="flex flex-col gap-5 max-w-sm">
          <div className="text-[#FCFCFD] text-base font-semibold mb-2">Stay Updated</div>
          <div className="text-[#777E90] text-base">
            Get the latest updates on new features, templates, and creator spotlights.
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#23262F] text-[#777E90] px-4 py-3 rounded-l-lg flex-1 border-none focus:outline-none focus:ring-2 focus:ring-[#EA6E48] transition-all" 
              disabled={isSubscribing}
            />
            <button 
              type="submit"
              disabled={isSubscribing}
              className="bg-[#EA6E48] hover:bg-[#EA6E48]/90 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-r-lg transition-colors"
            >
              {isSubscribing ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
      
      <div className="bg-[#353945] h-px w-full my-8" />
      
      <div className="flex justify-between text-[#777E90] text-sm flex-wrap gap-4">
        <div>Copyright © 2025 CRD. All rights reserved</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#FCFCFD] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#FCFCFD] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#FCFCFD] transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};
