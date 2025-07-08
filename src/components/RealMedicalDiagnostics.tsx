import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Heart, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Stethoscope,
  FileText,
  Shield
} from 'lucide-react';
import { medicalAI, DiagnosticResult, MedicalFinding } from '@/services/MedicalAI';
import { useToast } from '@/hooks/use-toast';

interface RealMedicalDiagnosticsProps {
  file: File;
  scanType: string;
  bodyPart: string;
  onDiagnosisComplete: (result: DiagnosticResult) => void;
}

export const RealMedicalDiagnostics: React.FC<RealMedicalDiagnosticsProps> = ({
  file,
  scanType,
  bodyPart,
  onDiagnosisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [userConsent, setUserConsent] = useState(false);
  const { toast } = useToast();

  const analysisSteps = [
    'Validating medical image format...',
    'Preprocessing DICOM data...',
    'Running AI diagnostic models...',
    'Generating Grad-CAM visualizations...',
    'Validating medical findings...',
    'Preparing clinical report...'
  ];

  const startDiagnosis = async () => {
    if (!userConsent) {
      toast({
        title: "Consent Required",
        description: "Please provide consent for AI medical analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Simulate progress through analysis steps
      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(analysisSteps[i]);
        
        for (let p = 0; p <= 100; p += 10) {
          setProgress((i * 100 + p) / analysisSteps.length);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Call real medical AI service
      const diagnosticResult = await medicalAI.diagnose(file, scanType, bodyPart);
      
      setResult(diagnosticResult);
      onDiagnosisComplete(diagnosticResult);

      // Show appropriate alerts based on severity
      if (diagnosticResult.severity === 'critical') {
        toast({
          title: "CRITICAL FINDING",
          description: "Urgent medical attention required. Contact emergency services immediately.",
          variant: "destructive"
        });
      } else if (diagnosticResult.severity === 'severe') {
        toast({
          title: "Significant Finding",
          description: "Medical evaluation recommended within 24 hours.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: `Diagnosis completed with ${diagnosticResult.confidence}% confidence`,
        });
      }

    } catch (error) {
      console.error('Medical diagnosis failed:', error);
      toast({
        title: "Diagnosis Failed",
        description: "Medical AI analysis encountered an error. Please try again or consult a medical professional.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'severe': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      case 'mild': return 'bg-blue-500 text-white';
      case 'normal': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Medical Disclaimer */}
      <Alert className="border-yellow-500 bg-yellow-50">
        <Shield className="w-4 h-4" />
        <AlertDescription>
          <strong>Medical AI Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.
        </AlertDescription>
      </Alert>

      {/* Consent Form */}
      {!userConsent && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Informed Consent for AI Medical Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p><strong>I understand that:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>This AI system provides diagnostic suggestions, not definitive diagnoses</li>
                <li>Results should be reviewed by qualified medical professionals</li>
                <li>AI may have false positives or miss certain conditions</li>
                <li>This tool does not replace clinical judgment or examination</li>
                <li>Emergency conditions require immediate medical attention regardless of AI results</li>
              </ul>
            </div>
            <Button 
              onClick={() => setUserConsent(true)}
              className="w-full"
            >
              I Consent to AI Medical Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Interface */}
      {userConsent && (
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Medical AI Diagnosis
              {result && (
                <Badge className={getSeverityColor(result.severity)}>
                  {result.severity.toUpperCase()}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !isAnalyzing && (
              <div className="text-center py-8 space-y-4">
                <Brain className="w-16 h-16 mx-auto text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Ready for Medical Analysis</h3>
                  <p className="text-muted-foreground">
                    {scanType} scan of {bodyPart} ready for AI diagnosis
                  </p>
                </div>
                <Button onClick={startDiagnosis} size="lg">
                  Start Medical AI Analysis
                </Button>
              </div>
            )}

            {isAnalyzing && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Activity className="w-8 h-8 animate-pulse text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Running Medical AI Analysis...</h3>
                    <p className="text-sm text-muted-foreground">{currentStep}</p>
                  </div>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-card">
                    <div className="text-2xl font-bold text-primary">{result.confidence}%</div>
                    <div className="text-sm text-muted-foreground">Confidence</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card">
                    <div className="text-2xl font-bold text-green-400">{result.processingTime}ms</div>
                    <div className="text-sm text-muted-foreground">Processing Time</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card">
                    <div className="text-2xl font-bold text-blue-400">{result.findings.length}</div>
                    <div className="text-sm text-muted-foreground">Findings</div>
                  </div>
                </div>

                {/* Medical Findings */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Medical Findings
                  </h4>
                  {result.findings.map((finding: MedicalFinding, index: number) => (
                    <div key={index} className="p-4 rounded-lg border bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getUrgencyIcon(finding.urgency)}
                          <span className="font-medium">{finding.condition}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{Math.round(finding.probability * 100)}%</Badge>
                          {finding.icd10Code && (
                            <Badge variant="secondary">{finding.icd10Code}</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{finding.description}</p>
                      {finding.location && (
                        <p className="text-xs text-muted-foreground">Location: {finding.location}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Clinical Recommendations
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Alert */}
                {result.severity === 'critical' && (
                  <Alert className="border-red-500 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      <strong>CRITICAL FINDING DETECTED:</strong> This scan shows findings that may require immediate medical attention. Please contact emergency services or go to the nearest emergency department immediately.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1">
                    Generate Medical Report
                  </Button>
                  <Button variant="outline">
                    Share with Physician
                  </Button>
                  <Button variant="outline">
                    Second Opinion
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};