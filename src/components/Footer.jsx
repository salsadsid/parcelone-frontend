import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-primary/5 bg-card/50 backdrop-blur-xl mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm">
                                P1
                            </div>
                            ParcelOne
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Next-gen logistics for a fast-paced world.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/salsadsid"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all duration-300"
                            >
                                <Github size={20} />
                            </a>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>© {new Date().getFullYear()} Built with</span>
                            <Heart size={14} className="text-red-500 fill-red-500" />
                            <span>by</span>
                            <a
                                href="https://github.com/salsadsid"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-foreground hover:text-primary transition-colors"
                            >
                                Salman Sadik Siddiquee
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
