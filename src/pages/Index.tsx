import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Heart, 
  Activity, 
  Eye, 
  Zap, 
  Shield, 
  Cpu, 
  Search,
  ArrowRight,
  Play,
  Upload,
  Users,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { label: "Scans Analyzed", value: "2.4M+", icon: Search },
    { label: "Accuracy Rate", value: "99.2%", icon: Zap },
    { label: "Response Time", value: "<800ms", icon: Activity },
    { label: "Medical Centers", value: "1,200+", icon: Users }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnostics",
      description: "Advanced neural networks analyze medical scans with 99.2% accuracy",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: Eye,
      title: "Holographic Visualization",
      description: "3D organ models and AR projection for immersive analysis",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with zero PHI storage",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Cpu,
      title: "Real-time Processing",
      description: "Sub-second inference with WebGPU acceleration",
      color: "from-pink-400 to-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gradient-medical">MedVision AI</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
          <a href="#technology" className="text-muted-foreground hover:text-primary transition-colors">Technology</a>
          <a href="#security" className="text-muted-foreground hover:text-primary transition-colors">Security</a>
        </nav>
        <Button 
          onClick={() => navigate('/dashboard')}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          Launch Platform
        </Button>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <Badge className="mb-6 bg-cyan-400/10 text-cyan-400 border-cyan-400/20">
            Next-Generation Medical AI
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="text-gradient-medical">Revolutionizing</span>
            <br />
            <span className="text-white">Medical Diagnostics</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Immersive 3D interfaces, real-time AI analysis, and holographic visualization 
            for the future of medical imaging and diagnostics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 py-4"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 text-lg px-8 py-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index} 
                  className={`glass-morphism transition-all duration-500 ${
                    currentStat === index ? 'medical-glow scale-105' : ''
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-medical">Advanced Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cutting-edge technology meets medical expertise in our comprehensive diagnostic platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass-morphism hover:medical-glow transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section id="technology" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-gradient-medical">Holographic</span>
                <br />
                <span className="text-white">Diagnostics</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Experience medical imaging like never before with our 3D holographic interfaces, 
                AR projection capabilities, and immersive organ visualization.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-medical" />
                  <span className="text-white">WebXR-based AR projection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-medical" />
                  <span className="text-white">Real-time 3D organ modeling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-medical" />
                  <span className="text-white">Haptic feedback integration</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="holographic rounded-2xl p-8 scan-line">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Heart className="w-12 h-12 text-red-400 float-animation" />
                    <span className="text-sm text-white">Cardiac</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Brain className="w-12 h-12 text-purple-400 float-animation" style={{ animationDelay: '0.5s' }} />
                    <span className="text-sm text-white">Neural</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Activity className="w-12 h-12 text-blue-400 float-animation" style={{ animationDelay: '1s' }} />
                    <span className="text-sm text-white">Pulmonary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-morphism medical-glow">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-gradient-medical">Ready to Transform</span>
                <br />
                <span className="text-white">Medical Diagnostics?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join leading medical institutions using MedVision AI for faster, 
                more accurate diagnoses with cutting-edge technology.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-12 py-4"
              >
                <Zap className="w-5 h-5 mr-2" />
                Launch MedVision AI
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-medical">MedVision AI</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 MedVision AI. Revolutionizing medical diagnostics with artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;