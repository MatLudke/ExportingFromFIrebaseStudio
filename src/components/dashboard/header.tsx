"use client"

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { UserNav } from './user-nav';
import { Logo } from '../logo';
import { MainNav } from './main-nav';
import { cn } from '@/lib/utils';

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    const [hidden, setHidden] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        if (hidden) {
            controls.start("hidden");
        } else {
            controls.start("visible");
        }
    }, [hidden, controls]);

    return (
        <motion.header 
            className="fixed top-0 left-0 right-0 z-20"
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            initial="visible"
            animate={controls}
            transition={{ duration: 0.35, ease: "easeInOut" }}
        >
            <div className="container mx-auto max-w-4xl">
                <div className="mt-4 flex items-center justify-between rounded-2xl border bg-background/80 p-4 shadow-lg backdrop-blur-lg">
                    <Logo />
                    <MainNav />
                    <UserNav />
                </div>
            </div>
        </motion.header>
    )
}
