import React from 'react';
import { Github, Heart, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useGetHealthQuery } from '@/features/auth/apiSlice';

const Footer = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Silently hit health check when on home page
    const { data: health, isSuccess, isError } = useGetHealthQuery(undefined, {
        skip: !isHomePage,
        pollingInterval: 60000, // Poll every minute when on home page
    });

    return (
        <footer className="border-t border-primary/5 bg-card/50 backdrop-blur-xl mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link to="/" className='flex items-center gap-2 group'>
                            <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <img src="parcelone_logo.png" alt="ParcelOne Logo" width={24} className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-bold text-primary tracking-tight">ParcelOne</h1>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Next-gen logistics for a fast-paced world.
                        </p>

                        {/* Health Status */}
                        {isHomePage && (
                            <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-muted/50 border border-muted w-fit">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${isSuccess ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isError ? 'bg-red-500' : 'bg-amber-500'}`} />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70">
                                    System {isSuccess ? 'Operational' : isError ? 'Offline' : 'Checking...'}
                                </span>
                            </div>
                        )}
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
