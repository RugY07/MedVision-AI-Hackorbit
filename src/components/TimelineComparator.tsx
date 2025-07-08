import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize
} from "lucide-react";

interface TimelineComparatorProps {
  scans: any[];
}

export const TimelineComparator = ({ scans }: TimelineComparatorProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState([0, 100]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [comparisonMode, setComparisonMode] = useState("side-by-side");

  // Mock historical data for demonstration
  const historicalScans = [
    {
      date: "2024-01-01",
      findings: ["Normal chest anatomy"],
      severity: "normal",
      confidence: 98.2
    },
    {
      date: "2024-01-08", 
      findings: ["Mild opacity in right lung"],
      severity: "mild",
      confidence: 94.5
    },
    {
      date: "2024-01-15",
      findings: ["Increased opacity", "Possible pneumonia"],
      severity: "moderate", 
      confidence: 96.8
    }
  ];

  const progressionData = [
    { date: "Jan 1", severity: 0, confidence: 98.2 },
    { date: "Jan 8", severity: 25, confidence: 94.5 },
    { date: "Jan 15", severity: 60, confidence: 96.8 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 bg-red-400/10";
      case "moderate": return "text-orange-400 bg-orange-400/10";
      case "mild": return "text-yellow-400 bg-yellow-400/10";
      case "normal": return "text-green-400 bg-green-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-red-400" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-green-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control timeline animation
  };

  return (
    <div className="space-y-6">
      {/* Timeline Controls */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-cyan-400" />
              <span>Time-Warp Comparator</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timeline Slider */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Jan 1, 2024</span>
              <span>Jan 15, 2024</span>
            </div>
            <Slider
              value={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-center space-x-2">
              <Button variant="ghost" size="sm">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={togglePlayback}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Comparison Mode Toggle */}
          <div className="flex justify-center space-x-2">
            <Button
              variant={comparisonMode === "side-by-side" ? "default" : "outline"}
              size="sm"
              onClick={() => setComparisonMode("side-by-side")}
              className={comparisonMode === "side-by-side" ? "bg-cyan-400/20 text-cyan-400" : ""}
            >
              Side by Side
            </Button>
            <Button
              variant={comparisonMode === "overlay" ? "default" : "outline"}
              size="sm"
              onClick={() => setComparisonMode("overlay")}
              className={comparisonMode === "overlay" ? "bg-cyan-400/20 text-cyan-400" : ""}
            >
              Overlay
            </Button>
            <Button
              variant={comparisonMode === "difference" ? "default" : "outline"}
              size="sm"
              onClick={() => setComparisonMode("difference")}
              className={comparisonMode === "difference" ? "bg-cyan-400/20 text-cyan-400" : ""}
            >
              Difference
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Historical Progression */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Disease Progression</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {historicalScans.map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">{scan.date}</p>
                    <p className="text-xs text-muted-foreground">
                      {index === 0 ? "Baseline" : `+${index * 7} days`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Badge className={getSeverityColor(scan.severity)}>
                      {scan.severity}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {scan.confidence}% confidence
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {index > 0 && getTrendIcon(
                    progressionData[index].severity,
                    progressionData[index - 1].severity
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Comparison View */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Maximize className="w-5 h-5 text-cyan-400" />
              <span>Visual Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-400/20 relative overflow-hidden">
              {comparisonMode === "side-by-side" ? (
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-cyan-400/20 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto" />
                      <p className="text-sm text-white">Jan 1 - Baseline</p>
                      <p className="text-xs text-muted-foreground">Normal</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto" />
                      <p className="text-sm text-white">Jan 15 - Current</p>
                      <p className="text-xs text-muted-foreground">Moderate</p>
                    </div>
                  </div>
                </div>
              ) : comparisonMode === "overlay" ? (
                <div className="relative h-full flex items-center justify-center">
                  <div className="absolute w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-50" />
                  <div className="absolute w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-50 translate-x-2 translate-y-2" />
                  <div className="text-center mt-24">
                    <p className="text-sm text-white">Overlay Comparison</p>
                    <p className="text-xs text-muted-foreground">Progression visible</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto" />
                    <p className="text-sm text-white">Difference Map</p>
                    <p className="text-xs text-muted-foreground">Changes highlighted</p>
                  </div>
                </div>
              )}
              
              {/* Scanning effect */}
              <div className="absolute inset-0 scan-line opacity-30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Summary */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>Progression Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-400">+35%</div>
              <p className="text-sm text-muted-foreground">Severity Increase</p>
              <TrendingUp className="w-6 h-6 text-red-400 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-cyan-400">14 days</div>
              <p className="text-sm text-muted-foreground">Time Period</p>
              <Calendar className="w-6 h-6 text-cyan-400 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-yellow-400">96.8%</div>
              <p className="text-sm text-muted-foreground">Latest Confidence</p>
              <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};