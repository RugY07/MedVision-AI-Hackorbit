import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Brain, 
  Heart, 
  Activity, 
  Eye, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Volume2,
  VolumeX,
  Users,
  History,
  Settings,
  Search,
  Scan,
  FileImage,
  ArrowRight,
  XCircle
} from "lucide-react";
import { MedicalScan } from "@/entities";
import { useToast } from "@/hooks/use-toast";
import { HolographicUploader } from "@/components/HolographicUploader";
import { ScanAnalyzer } from "@/components/ScanAnalyzer";
import { VoiceFeedback } from "@/components/VoiceFeedback";
import { CollaborationPanel } from "@/components/CollaborationPanel";
import { TimelineComparator } from "@/components/TimelineComparator";

const Dashboard = () => {
  const { toast } = useToast();
  const [scans, setScans] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");

  const stats = [
    { label: "Total Scans", value: "1,247", icon: Search, color: "text-cyan-400" },
    { label: "Pending Analysis", value: "23", icon: Clock, color: "text-yellow-400" },
    { label: "Critical Cases", value: "3", icon: AlertTriangle, color: "text-red-400" },
    { label: "Completed Today", value: "89", icon: CheckCircle, color: "text-green-400" }
  ];

  const recentScans = [
    {
      id: "1",
      patient_id: "PT-2024-001",
      scan_type: "Chest X-ray",
      body_part: "Chest",
      status: "completed",
      priority: "high",
      ai_analysis: {
        confidence: 94.2,
        findings: ["Possible consolidation in lower lobe", "Enlarged cardiac silhouette"],
        severity: "moderate"
      },
      scan_date: "2024-01-15"
    },
    {
      id: "2",
      patient_id: "PT-2024-002",
      scan_type: "Brain MRI",
      body_part: "Brain",
      status: "analyzing",
      priority: "critical",
      ai_analysis: null,
      scan_date: "2024-01-15"
    },
    {
      id: "3",
      patient_id: "PT-2024-003",
      scan_type: "Cardiac CT",
      body_part: "Heart",
      status: "completed",
      priority: "medium",
      ai_analysis: {
        confidence: 98.7,
        findings: ["Normal cardiac function"],
        severity: "normal"
      },
      scan_date: "2024-01-14"
    }
  ];

  useEffect(() => {
    // Simulate loading scans
    setScans(recentScans);
  }, []);

  const handleAnalysisResult = async (analysisResult) => {
    setIsAnalyzing(true);
    
    try {
      // Create scan record based on analysis result
      const newScan = {
        id: analysisResult.id,
        patient_id: `PT-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        scan_type: analysisResult.scanType || "Unknown",
        body_part: analysisResult.bodyPart || "Unknown",
        status: analysisResult.isValidMedicalScan ? "completed" : "invalid",
        priority: analysisResult.isValidMedicalScan ? 
          (analysisResult.severity === "moderate" ? "high" : 
           analysisResult.severity === "mild" ? "medium" : "low") : "invalid",
        ai_analysis: analysisResult.isValidMedicalScan ? {
          confidence: analysisResult.confidence,
          findings: analysisResult.findings,
          severity: analysisResult.severity,
          recommendations: analysisResult.recommendations
        } : null,
        scan_date: new Date().toISOString().split('T')[0],
        file_info: analysisResult.file,
        image_characteristics: analysisResult.imageCharacteristics,
        isValidMedicalScan: analysisResult.isValidMedicalScan
      };

      // Add to scans list
      setScans(prev => [newScan, ...prev]);
      
      // Voice feedback
      if (voiceEnabled) {
        if (!analysisResult.isValidMedicalScan) {
          // Trigger voice feedback for invalid scan
          if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(
              "Invalid medical scan detected. Please upload a valid medical image."
            );
            window.speechSynthesis.speak(utterance);
          }
        } else {
          // Trigger voice feedback for successful analysis
          if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(
              `${analysisResult.scanType} analysis complete. ${analysisResult.confidence} percent confidence. ${analysisResult.severity} severity detected.`
            );
            window.speechSynthesis.speak(utterance);
          }
        }
      }

      // Haptic feedback
      if (navigator.vibrate) {
        if (!analysisResult.isValidMedicalScan) {
          // Error pattern
          navigator.vibrate([100, 100, 100, 100, 100]);
        } else if (analysisResult.severity === "moderate") {
          // Warning pattern
          navigator.vibrate([200, 100, 200]);
        } else {
          // Success pattern
          navigator.vibrate([100]);
        }
      }

    } catch (error) {
      console.error('Error processing analysis result:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process the analysis result",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "high": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "invalid": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "analyzing": return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-400" />;
      case "critical": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "invalid": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-medical">MedVision AI</h1>
              <p className="text-sm text-muted-foreground">Medical Diagnostics Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={voiceEnabled ? "text-cyan-400" : "text-muted-foreground"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Collaborate
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-morphism">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-xl">
            <TabsTrigger value="upload" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="analyze" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">
              <Scan className="w-4 h-4 mr-2" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="collaborate" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">
              <Users className="w-4 h-4 mr-2" />
              Collaborate
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">
              <Activity className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileImage className="w-5 h-5 text-cyan-400" />
                    <span>Smart Medical Uploader</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HolographicUploader 
                    onUpload={handleAnalysisResult}
                    isAnalyzing={isAnalyzing}
                  />
                </CardContent>
              </Card>

              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span>AI Analysis Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
                        <span>Processing medical scan...</span>
                      </div>
                      <Progress value={75} className="w-full" />
                      <p className="text-sm text-muted-foreground">
                        Running computer vision analysis and medical validation...
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Upload a medical scan to begin intelligent AI analysis
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Only valid medical scans will be processed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-6">
            <ScanAnalyzer scans={scans} onSelectScan={setSelectedScan} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  <span>Recent Scans</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scans.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(scan.status)}
                          <span className="font-medium">{scan.patient_id}</span>
                        </div>
                        <Badge className={getPriorityColor(scan.priority)}>
                          {scan.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {scan.scan_type} • {scan.body_part}
                        </span>
                        {scan.status === "invalid" && (
                          <Badge variant="destructive" className="text-xs">
                            Invalid Scan
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        {scan.ai_analysis && (
                          <span className="text-sm text-cyan-400">
                            {scan.ai_analysis.confidence}% confidence
                          </span>
                        )}
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborate" className="space-y-6">
            <CollaborationPanel scans={scans.filter(scan => scan.isValidMedicalScan !== false)} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <TimelineComparator scans={scans.filter(scan => scan.isValidMedicalScan !== false)} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Voice Feedback Component */}
      <VoiceFeedback enabled={voiceEnabled} />
    </div>
  );
};

export default Dashboard;