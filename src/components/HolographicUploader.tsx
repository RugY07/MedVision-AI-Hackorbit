import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileImage, 
  Brain, 
  Heart, 
  Activity, 
  Eye,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { imageAnalyzer } from "./ImageAnalyzer";
import { useToast } from "@/hooks/use-toast";

interface HolographicUploaderProps {
  onUpload: (analysisResult: any) => void;
  isAnalyzing: boolean;
}

export const HolographicUploader = ({ onUpload, isAnalyzing }: HolographicUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedOrgan, setSelectedOrgan] = useState("brain");
  const [currentStep, setCurrentStep] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const organs = [
    { id: "brain", icon: Brain, label: "Brain", color: "text-purple-400" },
    { id: "heart", icon: Heart, label: "Heart", color: "text-red-400" },
    { id: "lungs", icon: Activity, label: "Lungs", color: "text-blue-400" },
    { id: "eyes", icon: Eye, label: "Eyes", color: "text-green-400" }
  ];

  const analysisSteps = [
    'Validating medical scan...',
    'Analyzing image characteristics...',
    'Detecting scan type and anatomy...',
    'Running AI diagnostic analysis...',
    'Generating clinical report...'
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(Array.from(files));
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  }, []);

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    try {
      // Reset progress
      setUploadProgress(0);
      setAnalysisProgress(0);

      // Simulate upload progress
      setCurrentStep('Uploading file...');
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Start analysis with progress tracking
      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(analysisSteps[i]);
        
        // Simulate step progress
        for (let progress = 0; progress <= 100; progress += 20) {
          setAnalysisProgress((i * 100 + progress) / analysisSteps.length);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Perform actual image analysis
      setCurrentStep('Processing image data...');
      const analysisResult = await imageAnalyzer.analyzeImage(file);

      // Add file metadata to result
      const enrichedResult = {
        ...analysisResult,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        },
        uploadedAt: new Date(),
        id: Date.now().toString()
      };

      // Show appropriate toast based on analysis result
      if (!analysisResult.isValidMedicalScan) {
        toast({
          title: "Invalid Medical Scan",
          description: "The uploaded file does not appear to be a valid medical scan. Please upload X-ray, MRI, CT, or other medical imaging files.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: `${analysisResult.scanType} of ${analysisResult.bodyPart} analyzed with ${analysisResult.confidence}% confidence`,
        });
      }

      // Pass result to parent component
      onUpload(enrichedResult);

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the uploaded file. Please try again with a valid medical scan.",
        variant: "destructive"
      });
    } finally {
      // Reset progress
      setUploadProgress(0);
      setAnalysisProgress(0);
      setCurrentStep("");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Organ Selection */}
      <div className="grid grid-cols-4 gap-3">
        {organs.map((organ) => {
          const Icon = organ.icon;
          return (
            <Button
              key={organ.id}
              variant={selectedOrgan === organ.id ? "default" : "outline"}
              className={cn(
                "h-16 flex-col space-y-1",
                selectedOrgan === organ.id 
                  ? "bg-cyan-400/20 border-cyan-400/50 text-cyan-400" 
                  : "border-border/50 hover:border-cyan-400/30"
              )}
              onClick={() => setSelectedOrgan(organ.id)}
            >
              <Icon className={`w-6 h-6 ${selectedOrgan === organ.id ? "text-cyan-400" : organ.color}`} />
              <span className="text-xs">{organ.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Holographic Drop Zone */}
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer",
          isDragOver 
            ? "medical-glow scale-105" 
            : "glass-morphism hover:border-cyan-400/30",
          isAnalyzing && "animate-pulse"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className="p-12 text-center relative">
          {/* Holographic Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse" />
          
          {/* Scanning Lines */}
          {(isDragOver || isAnalyzing || uploadProgress > 0) && (
            <div className="absolute inset-0 scan-line" />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.dcm,.dicom"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="relative z-10">
            {isAnalyzing || analysisProgress > 0 ? (
              <div className="space-y-4">
                <Zap className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
                <h3 className="text-xl font-semibold text-white">Analyzing Medical Scan</h3>
                <p className="text-muted-foreground">{currentStep}</p>
                <Progress value={analysisProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(analysisProgress)}% Complete
                </p>
              </div>
            ) : uploadProgress > 0 ? (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-cyan-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white">Uploading</h3>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <FileImage className="w-16 h-16 text-cyan-400 mx-auto" />
                  {isDragOver && (
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {isDragOver ? "Drop to Upload" : "Holographic Scan Upload"}
                </h3>
                <p className="text-muted-foreground">
                  Drag and drop medical scans or click to browse
                </p>
                <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                  <span>DICOM</span>
                  <span>•</span>
                  <span>JPG</span>
                  <span>•</span>
                  <span>PNG</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-card/30">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-muted-foreground">Smart Validation</span>
        </div>
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-card/30">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span className="text-muted-foreground">Real-time Analysis</span>
        </div>
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-card/30">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span className="text-muted-foreground">Medical Scan Only</span>
        </div>
      </div>

      {/* Analysis Requirements */}
      <Card className="glass-morphism">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            AI Analysis Requirements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-2 text-green-400">✓ Supported</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Medical X-rays, MRI, CT scans</li>
                <li>• DICOM format files</li>
                <li>• High-contrast medical images</li>
                <li>• Grayscale anatomical scans</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2 text-red-400">✗ Not Supported</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Regular photos or screenshots</li>
                <li>• Non-medical images</li>
                <li>• Low-quality or blurry images</li>
                <li>• Text documents or charts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};