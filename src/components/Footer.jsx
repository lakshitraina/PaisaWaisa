import { Link } from "react-router-dom";
import { companyConfig } from "../config/company";
import { Facebook, Twitter, Instagram, Linkedin, Wallet, Phone, Mail, MapPin } from "lucide-react";
import logoWhite from "../assets/Paisawaisafavblackwhite.png";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto border-t border-slate-800">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold text-xl">
                        <img src={logoWhite} alt={companyConfig.name} className="h-10 w-auto object-contain" />
                    </div>
                    <p className="text-sm text-slate-400">
                        Making personal finance simple, social, and smart. Track expenses, split bills, and grow your wealth.
                    </p>
                    <div className="pt-4 border-t border-slate-800">
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Parent Company</p>
                        <p className="text-sm font-bold text-white tracking-wide">{companyConfig.parentCompany}</p>
                        <p className="text-xs text-slate-500">Owned by {companyConfig.owner}</p>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        <li><Link to="/insights" className="hover:text-primary transition-colors">Insights</Link></li>
                        <li><Link to="/family" className="hover:text-primary transition-colors">Family Circle</Link></li>
                        <li><Link to="/loans" className="hover:text-primary transition-colors">Loans & EMI</Link></li>
                        <li><Link to="/credit-health" className="hover:text-primary transition-colors">Credit Health</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Legal</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        <li><Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-primary shrink-0" />
                            <span>{companyConfig.contact.phone}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-primary shrink-0" />
                            <span>{companyConfig.contact.email}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0" />
                            <span>{companyConfig.contact.address}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} {companyConfig.name}. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a href={companyConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        <Facebook className="h-5 w-5" />
                    </a>
                    <a href={companyConfig.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        <Twitter className="h-5 w-5" />
                    </a>
                    <a href={companyConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        <Instagram className="h-5 w-5" />
                    </a>
                    <a href={companyConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        <Linkedin className="h-5 w-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
