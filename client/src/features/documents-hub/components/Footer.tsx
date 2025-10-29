import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white mt-16 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">IterativStartups</h3>
            <p className="text-sm text-slate-400">The comprehensive AI-powered business innovation platform.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Documents Hub</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition-colors">IterativPlans</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">IterativDecks</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">IterativProposals</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">IterativForms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Methodology</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Certification</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Partners</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-sm text-slate-400">© 2025 IterativStartups Inc. • "Where uncertainty becomes strategy."</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;