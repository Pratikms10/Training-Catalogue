import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { CategoryId } from '../types';

interface FooterStructureProps {
  onSelectCategory?: (id: CategoryId) => void;
  onOpenInquiry?: () => void;
}

export const FooterStructure: React.FC<FooterStructureProps> = ({
  onSelectCategory,
  onOpenInquiry,
}) => {
  const handleCategoryClick = (e: React.MouseEvent, catId: CategoryId) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(catId);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <footer id="technoedge-corporate-footer" className="w-full bg-white text-slate-800 border-t border-[rgba(0,0,255,0.12)] mt-auto">
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Col 1: Contact Info */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-[rgba(0,0,255,0.12)] pb-2 text-slate-900">
              Contact Info
            </h3>
            
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#0000FF] shrink-0" />
                <a href="tel:+919356433629" className="hover:text-[#0000FF]/70 transition-colors underline-offset-2 hover:underline">
                  +91 9356433629
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0000FF] shrink-0" />
                <a href="mailto:info@technoedgels.com" className="hover:text-[#0000FF]/70 transition-colors underline-offset-2 hover:underline">
                  info@technoedgels.com
                </a>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <MapPin className="w-4 h-4 text-[#0000FF] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block mb-1 text-slate-900">Registered Office:</strong>
                  Office No. B-2/201,<br/>
                  Umang Premiere,<br/>
                  G.No.677, 687(P), 6 Tal-Haveli,<br/>
                  Dist-Pune, Wagholi-412207,<br/>
                  Maharashtra, India
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <MapPin className="w-4 h-4 text-[#0000FF] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block mb-1 text-slate-900">Head Office:</strong>
                  Baner Biz Bay,<br/>
                  Office No. B-704, B-705 & B-706,<br/>
                  7th Floor, Laxman Nagar,<br/>
                  Baner, Pune - 411045,<br/>
                  Maharashtra, India
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[rgba(0,0,255,0.12)] pb-2 text-slate-900">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors">Corporate Training</a></li>
              <li><a href="#" className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors">E-learning Solution</a></li>
              <li><a href="#" className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors">Business Consultation</a></li>
              <li><a href="#" className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 400, behavior: 'smooth' }); }}>Explore Programmes</a></li>
              <li><a href="#" className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors" onClick={(e) => { e.preventDefault(); onOpenInquiry?.(); }}>Contact Us</a></li>
            </ul>
          </div>

          {/* Col 3: Explore Training */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[rgba(0,0,255,0.12)] pb-2 text-slate-900">
              Explore Training
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(e, 'role-based')}
                  className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors text-left cursor-pointer"
                >
                  Role-Based Training
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(e, 'tools-technology')}
                  className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors text-left cursor-pointer"
                >
                  Tools & Technology
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(e, 'process-based')}
                  className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors text-left cursor-pointer"
                >
                  Process Based
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(e, 'certifications')}
                  className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors text-left cursor-pointer"
                >
                  Certifications
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(e, 'ai-tools')}
                  className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors text-left cursor-pointer"
                >
                  AI Tools
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(e, 'people-behavioural')}
                  className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors text-left cursor-pointer"
                >
                  People &amp; Behavioural
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us / Policies */}
          <div className="flex flex-col space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[rgba(0,0,255,0.12)] pb-2 text-slate-900">
                Follow Us
              </h3>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(33,150,243,0.08)] border border-[rgba(0,0,255,0.12)] text-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 border-b border-[rgba(0,0,255,0.12)] pb-2 text-slate-900">
                Policies
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-[#0000FF]/70 hover:underline underline-offset-2 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-[rgba(0,0,255,0.12)] bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 text-center">
          <p className="text-sm text-slate-500">
            © TechnoEdge Learning Services. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
