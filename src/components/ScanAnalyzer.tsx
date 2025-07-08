import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Heart, 
  Activity, 
  Eye, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Volume2,
  Maximize,
  RotateCcw,
  Share
} from "lucide-react";

interface ScanAnalyzerProps {
  scans: any[];
  onSelectScan: (scan: any) => void;
}

export const ScanAnalyzer = ({ scans, onSelectScan }: ScanAnalyzerProps) => {
  const [selectedScan, setSelectedScan] = useState(scans[0] || null);
  const [view3D, setView3D] = useState(false);

  const getOrganIcon = (bodyPart: string) => {
    switch (bodyPart.toLowerCase()) {
      case "brain": return Brain;
      case "heart": return Heart;
      case "chest": case "lungs": return Activity;
      case "eyes": return Eye;
      default: return Brain;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 bg-red-400/10";
      case "moderate": return "text-orange-400 bg-orange-400/10";
      case "mild": return "text-yellow-400 bg-yellow-400/10";
      case "normal": return "text-green-400 bg-green-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const handleScanSelect = (scan: any) => {
    setSelectedScan(scan);
    onSelectScan(scan);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Scan List */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Active Scans</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scans.map((scan) => {
            const Icon = getOrganIcon(scan.body_part);
            return (
              <div
                key={scan.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedScan?.id === scan.id
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-border/50 hover:border-cyan-400/30"
                }`}
                onClick={() => handleScanSelect(scan)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium text-sm">{scan.patient_id}</span>
                  </div>
                  {scan.status === "analyzing" && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {scan.scan_type} • {scan.body_part}
                </p>
                {scan.ai_analysis && (
                  <div className="flex items-center justify-between">
                    <Badge className={getSeverityColor(scan.ai_analysis.severity)}>
                      {scan.ai_analysis.severity}
                    </Badge>
                    <span className="text-xs text-cyan-400">
                      {scan.ai_analysis.confidence}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 3D Visualization */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>3D Visualization</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setView3D(!view3D)}>
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-400/20 relative overflow-hidden">
            {/* 3D Scan Visualization Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              {selectedScan ? (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center rotate-3d">
                    {(() => {
                      const Icon = getOrganIcon(selectedScan.body_part);
                      return <Icon className="w-12 h-12 text-white" />;
                    })()}
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-medium">{selectedScan.scan_type}</p>
                    <p className="text-sm text-muted-foreground">{selectedScan.body_part} Analysis</p>
                  </div>
                  {/* Scanning effect */}
                  <div className="absolute inset-0 scan-line opacity-50" />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select a scan to view 3D model</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>AI Analysis</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedScan?.ai_analysis ? (
            <>
              {/* Confidence Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span className="text-sm font-medium text-cyan-400">
                    {selectedScan.ai_analysis.confidence}%
                  </span>
                </div>
                <Progress value={selectedScan.ai_analysis.confidence} className="h-2" />
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Severity</span>
                <Badge className={getSeverityColor(selectedScan.ai_analysis.severity)}>
                  {selectedScan.ai_analysis.severity.toUpperCase()}
                </Badge>
              </div>

              {/* Findings */}
              <div className="space-y-3">
                <span className="text-sm text-muted-foreground">Key Findings</span>
                <div className="space-y-2">
                  {selectedScan.ai_analysis.findings.map((finding: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2 p-3 rounded-lg bg-card/30">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {selectedScan.ai_analysis.recommendations && (
                <div className="space-y-3">
                  <span className="text-sm text-muted-foreground">Recommendations</span>
                  <div className="space-y-2">
                    {selectedScan.ai_analysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-3 rounded-lg bg-card/30">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600">
                  Generate Report
                </Button>
                <Button variant="outline" className="border-cyan-400/30">
                  Share
                </Button>
              </div>
            </>
          ) : selectedScan?.status === "analyzing" ? (
            <div className="text-center py-8 space-y-4">
              <Zap className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
              <div>
                <p className="font-medium">AI Analysis in Progress</p>
                <p className="text-sm text-muted-foreground">Running neural network inference...</p>
              </div>
              <Progress value={65} className="w-full" />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select a completed scan to view analysis</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};