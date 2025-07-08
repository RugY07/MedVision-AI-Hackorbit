import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Eye, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  Download,
  Share
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface DiagnosticAnalyzerProps {
  scanData: any;
  selectedOrgan: string;
  isAnalyzing: boolean;
  onAnalysisComplete: (results: any) => void;
}

export const DiagnosticAnalyzer: React.FC<DiagnosticAnalyzerProps> = ({
  scanData,
  selectedOrgan,
  isAnalyzing,
  onAnalysisComplete
}) => {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [results, setResults] = useState<any>(null);
  const [confidence, setConfidence] = useState(0);
  const { toast } = useToast();

  const analysisSteps = [
    'Preprocessing scan data...',
    'Running AI model inference...',
    'Generating Grad-CAM visualization...',
    'Calculating confidence scores...',
    'Preparing diagnostic report...'
  ];

  useEffect(() => {
    if (scanData && !isAnalyzing) {
      startAnalysis();
    }
  }, [scanData]);

  const startAnalysis = async () => {
    if (!scanData) return;

    setAnalysisProgress(0);
    
    // Simulate AI analysis process
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(analysisSteps[i]);
      
      for (let progress = 0; progress <= 100; progress += 5) {
        setAnalysisProgress((i * 100 + progress) / analysisSteps.length);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    // Generate mock results
    const mockResults = generateMockResults(selectedOrgan);
    setResults(mockResults);
    setConfidence(mockResults.confidence);
    onAnalysisComplete(mockResults);

    toast({
      title: "Analysis Complete",
      description: `${selectedOrgan} scan analyzed with ${mockResults.confidence}% confidence`,
    });
  };

  const generateMockResults = (organ: string) => {
    const baseResults = {
      organ,
      confidence: Math.floor(Math.random() * 15) + 85, // 85-100%
      timestamp: new Date(),
      processingTime: Math.floor(Math.random() * 500) + 300, // 300-800ms
    };

    switch (organ) {
      case 'heart':
        return {
          ...baseResults,
          findings: [
            { type: 'Normal', description: 'Cardiac structure appears normal', severity: 'normal' },
            { type: 'Mild enlargement', description: 'Slight left ventricular enlargement detected', severity: 'warning' },
          ],
          measurements: {
            'Ejection Fraction': '65%',
            'Left Ventricular Mass': '142g',
            'Cardiac Output': '5.2 L/min'
          },
          recommendations: [
            'Continue regular monitoring',
            'Consider echocardiogram follow-up in 6 months',
            'Maintain current medication regimen'
          ]
        };
      
      case 'brain':
        return {
          ...baseResults,
          findings: [
            { type: 'Normal', description: 'No acute abnormalities detected', severity: 'normal' },
            { type: 'Small vessel disease', description: 'Mild chronic small vessel changes', severity: 'warning' },
          ],
          measurements: {
            'Brain Volume': '1,350 cm³',
            'Ventricular Size': 'Normal',
            'Cortical Thickness': '2.8mm'
          },
          recommendations: [
            'No immediate intervention required',
            'Annual follow-up recommended',
            'Monitor for cognitive changes'
          ]
        };
      
      case 'lungs':
        return {
          ...baseResults,
          findings: [
            { type: 'Clear', description: 'Lungs appear clear with no acute findings', severity: 'normal' },
            { type: 'Minor scarring', description: 'Minimal pleural scarring noted', severity: 'warning' },
          ],
          measurements: {
            'Lung Capacity': '4,200 mL',
            'Pleural Thickness': '1.2mm',
            'Nodule Count': '0'
          },
          recommendations: [
            'Continue current treatment',
            'Routine follow-up in 12 months',
            'Smoking cessation if applicable'
          ]
        };
      
      default:
        return baseResults;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'normal': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card className="holographic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            AI Diagnostic Analysis
            {results && (
              <Badge variant="outline" className="ml-auto">
                {confidence}% Confidence
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!scanData ? (
            <div className="text-center py-8">
              <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Scan Data</h3>
              <p className="text-muted-foreground">
                Please upload a scan to begin AI analysis
              </p>
            </div>
          ) : analysisProgress < 100 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold">Analyzing {selectedOrgan} scan...</h3>
                  <p className="text-sm text-muted-foreground">{currentStep}</p>
                </div>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(analysisProgress)}% Complete
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold">Analysis Complete</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="diagnostic-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{confidence}%</div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
                <div className="diagnostic-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{results?.processingTime}ms</div>
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                </div>
                <div className="diagnostic-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{results?.findings?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Findings</div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Tabs defaultValue="findings" className="w-full">
              <TabsList className="grid w-full grid-cols-4 holographic">
                <TabsTrigger value="findings">Findings</TabsTrigger>
                <TabsTrigger value="measurements">Measurements</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="findings" className="mt-6">
                <Card className="holographic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Clinical Findings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.findings?.map((finding: any, index: number) => {
                        const SeverityIcon = getSeverityIcon(finding.severity);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-4 diagnostic-card rounded-lg"
                          >
                            <SeverityIcon className={`w-5 h-5 mt-1 ${getSeverityColor(finding.severity)}`} />
                            <div className="flex-1">
                              <h4 className="font-semibold">{finding.type}</h4>
                              <p className="text-sm text-muted-foreground">{finding.description}</p>
                            </div>
                            <Badge 
                              variant={finding.severity === 'normal' ? 'default' : 'destructive'}
                              className="capitalize"
                            >
                              {finding.severity}
                            </Badge>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="measurements" className="mt-6">
                <Card className="holographic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Quantitative Measurements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(results.measurements || {}).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="diagnostic-card p-4 rounded-lg"
                        >
                          <div className="text-sm text-muted-foreground">{key}</div>
                          <div className="text-2xl font-bold text-primary">{value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visualization" className="mt-6">
                <Card className="holographic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Grad-CAM Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Heatmap Visualization</h3>
                        <p className="text-muted-foreground">
                          AI attention areas highlighted in real-time
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6">
                <Card className="holographic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Clinical Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.recommendations?.map((recommendation: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 diagnostic-card rounded-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span>{recommendation}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};