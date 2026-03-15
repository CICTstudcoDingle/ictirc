"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Users, GraduationCap, Briefcase } from "lucide-react";

interface LiveCounterProps {
  initialCounts?: {
    students: number;
    faculty: number;
    alumni: number;
  };
}

interface CounterItemProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}

function CounterItem({ icon, label, count, color }: CounterItemProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef({ value: 0 });

  useEffect(() => {
    gsap.to(countRef.current, {
      value: count,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.textContent = Math.round(
            countRef.current.value
          ).toLocaleString();
        }
      },
    });
  }, [count]);

  return (
    <div className="glass-card-elevated p-6 text-center group hover:scale-105 transition-transform duration-300">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${color}`}
      >
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
        <span ref={numberRef}>0</span>
      </div>
      <div className="text-sm font-medium text-white/50 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

export default function LiveCounter({
  initialCounts = { students: 0, faculty: 0, alumni: 0 },
}: LiveCounterProps) {
  const [counts, setCounts] = useState(initialCounts);
  const sectionRef = useRef<HTMLElement>(null);

  // Poll for updated counts every 60 seconds
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/portal/stats");
        if (res.ok) {
          const data = await res.json();
          setCounts(data);
        }
      } catch {
        // Silently fail — use cached counts
      }
    };

    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge-gold mb-4 inline-block">Live Statistics</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mt-4">
            Our Growing Community
          </h2>
          <p className="text-white/50 mt-3 max-w-md mx-auto">
            Real-time count of the CICT family — students, faculty, and
            alumni.
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CounterItem
            icon={<GraduationCap className="w-6 h-6 text-gold-400" />}
            label="Students"
            count={counts.students}
            color="bg-gold/10"
          />
          <CounterItem
            icon={<Briefcase className="w-6 h-6 text-blue-400" />}
            label="Faculty"
            count={counts.faculty}
            color="bg-blue-500/10"
          />
          <CounterItem
            icon={<Users className="w-6 h-6 text-emerald-400" />}
            label="Alumni"
            count={counts.alumni}
            color="bg-emerald-500/10"
          />
        </div>
      </div>
    </section>
  );
}
