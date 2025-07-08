import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Users, Clock, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const DiagnosticStats = () => {
  const [stats, setStats] = useState({
    scansProcessed: 0,
    accuracy: 0,
    activeUsers: 0,
    avgProcessingTime: 0,
    uptime: 0,
    compliance: 0
  });

  useEffect(() => {
    // Animate stats on mount
    const targetStats = {
      scansProcessed: 15847,
      accuracy: 97.3,
      activeUsers: 234,
      avgProcessingTime: 650,
      uptime: 99.9,
      compliance: 100
    };

    const animateStats = () => {
      Object.keys(targetStats).forEach((key) => {
        const target = targetStats[key as keyof typeof targetStats];
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          
          setStats(prev => ({
            ...prev,
            [key]: Math.floor(current)
          }));
        }, 50);
      });
    };

    const timeout = setTimeout(animateStats, 500);
    return () => clearTimeout(timeout);
  }, []);

  const statItems = [
    {
      icon: Activity,
      label: 'Scans Processed',
      value: stats.scansProcessed.toLocaleString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Zap,
      label: 'AI Accuracy',
      value: `${stats.accuracy}%`,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      icon: Users,
      label: 'Active Users',
      value: stats.activeUsers.toString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      icon: Clock,
      label: 'Avg Processing',
      value: `${stats.avgProcessingTime}ms`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      icon: TrendingUp,
      label: 'System Uptime',
      value: `${stats.uptime}%`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      icon: Shield,
      label: 'HIPAA Compliance',
      value: `${stats.compliance}%`,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card className="holographic hover:medical-glow transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-3`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className={`text-2xl font-bold ${item.color} mb-1`}>
                {item.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.label}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};