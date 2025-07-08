import { uploadFile } from "@/integrations/core";

export interface DiagnosticResult {
  patientId: string;
  scanType: string;
  bodyPart: string;
  findings: MedicalFinding[];
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'critical';
  recommendations: string[];
  gradCamUrl?: string;
  processingTime: number;
  timestamp: Date;
}

export interface MedicalFinding {
  condition: string;
  probability: number;
  location?: string;
  description: string;
  icd10Code?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface ModelConfig {
  modelType: 'chest_xray' | 'brain_mri' | 'ct_scan' | 'mammography';
  apiEndpoint: string;
  apiKey: string;
  modelVersion: string;
}

export class MedicalAIService {
  private models: Map<string, ModelConfig> = new Map();
  
  constructor() {
    this.initializeModels();
  }

  private initializeModels() {
    // Configure different AI models for different scan types
    this.models.set('chest_xray', {
      modelType: 'chest_xray',
      apiEndpoint: 'https://api.example-medical-ai.com/v1/chest-xray',
      apiKey: process.env.CHEST_XRAY_API_KEY || '',
      modelVersion: 'v2.1'
    });

    this.models.set('brain_mri', {
      modelType: 'brain_mri',
      apiEndpoint: 'https://api.example-medical-ai.com/v1/brain-mri',
      apiKey: process.env.BRAIN_MRI_API_KEY || '',
      modelVersion: 'v1.8'
    });

    this.models.set('ct_scan', {
      modelType: 'ct_scan',
      apiEndpoint: 'https://api.example-medical-ai.com/v1/ct-scan',
      apiKey: process.env.CT_SCAN_API_KEY || '',
      modelVersion: 'v1.5'
    });
  }

  async diagnose(file: File, scanType: string, bodyPart: string): Promise<DiagnosticResult> {
    const startTime = Date.now();
    
    try {
      // Step 1: Upload and preprocess the medical image
      const preprocessedImage = await this.preprocessMedicalImage(file, scanType);
      
      // Step 2: Select appropriate AI model
      const modelKey = this.getModelKey(scanType, bodyPart);
      const model = this.models.get(modelKey);
      
      if (!model) {
        throw new Error(`No AI model available for ${scanType} of ${bodyPart}`);
      }

      // Step 3: Send to medical AI service
      const aiResponse = await this.callMedicalAI(preprocessedImage, model);
      
      // Step 4: Generate Grad-CAM visualization
      const gradCamUrl = await this.generateGradCAM(preprocessedImage, aiResponse, model);
      
      // Step 5: Process and validate results
      const diagnosticResult = await this.processAIResponse(
        aiResponse, 
        scanType, 
        bodyPart, 
        gradCamUrl,
        Date.now() - startTime
      );

      return diagnosticResult;
      
    } catch (error) {
      console.error('Medical AI diagnosis failed:', error);
      throw new Error(`Diagnosis failed: ${error.message}`);
    }
  }

  private async preprocessMedicalImage(file: File, scanType: string): Promise<string> {
    // Upload the original file
    const { file_url } = await uploadFile({ file });
    
    // In a real implementation, you would:
    // 1. Convert to DICOM format if needed
    // 2. Apply medical image preprocessing (windowing, normalization)
    // 3. Resize to model input requirements
    // 4. Apply scan-specific preprocessing
    
    return file_url;
  }

  private getModelKey(scanType: string, bodyPart: string): string {
    // Map scan types and body parts to appropriate AI models
    const scanTypeLower = scanType.toLowerCase();
    const bodyPartLower = bodyPart.toLowerCase();
    
    if (scanTypeLower.includes('x-ray') || scanTypeLower.includes('xray')) {
      if (bodyPartLower.includes('chest') || bodyPartLower.includes('lung')) {
        return 'chest_xray';
      }
    }
    
    if (scanTypeLower.includes('mri')) {
      if (bodyPartLower.includes('brain') || bodyPartLower.includes('head')) {
        return 'brain_mri';
      }
    }
    
    if (scanTypeLower.includes('ct') || scanTypeLower.includes('cat')) {
      return 'ct_scan';
    }
    
    // Default to chest X-ray model
    return 'chest_xray';
  }

  private async callMedicalAI(imageUrl: string, model: ModelConfig): Promise<any> {
    // This would call a real medical AI service
    // For demonstration, I'll show the structure
    
    const requestBody = {
      image_url: imageUrl,
      model_version: model.modelVersion,
      return_gradcam: true,
      confidence_threshold: 0.7
    };

    // In a real implementation:
    /*
    const response = await fetch(model.apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    return await response.json();
    */

    // Mock response for demonstration
    return this.getMockAIResponse(model.modelType);
  }

  private getMockAIResponse(modelType: string): any {
    // This simulates what a real medical AI would return
    switch (modelType) {
      case 'chest_xray':
        return {
          predictions: [
            { condition: 'Pneumonia', probability: 0.85, location: 'Right lower lobe', icd10: 'J18.9' },
            { condition: 'Pleural Effusion', probability: 0.23, location: 'Left costophrenic angle', icd10: 'J94.8' },
            { condition: 'Cardiomegaly', probability: 0.67, location: 'Cardiac silhouette', icd10: 'I51.7' }
          ],
          overall_confidence: 0.89,
          gradcam_regions: [
            { x: 120, y: 80, width: 60, height: 40, intensity: 0.85 },
            { x: 200, y: 150, width: 45, height: 35, intensity: 0.67 }
          ]
        };
      
      case 'brain_mri':
        return {
          predictions: [
            { condition: 'Ischemic Stroke', probability: 0.78, location: 'Left MCA territory', icd10: 'I63.9' },
            { condition: 'White Matter Hyperintensities', probability: 0.45, location: 'Periventricular', icd10: 'I67.850' }
          ],
          overall_confidence: 0.82,
          gradcam_regions: [
            { x: 95, y: 110, width: 25, height: 30, intensity: 0.78 }
          ]
        };
      
      default:
        return {
          predictions: [
            { condition: 'Normal Study', probability: 0.92, location: 'Overall', icd10: 'Z00.00' }
          ],
          overall_confidence: 0.92,
          gradcam_regions: []
        };
    }
  }

  private async generateGradCAM(imageUrl: string, aiResponse: any, model: ModelConfig): Promise<string> {
    // Generate Grad-CAM heatmap overlay
    // This would typically be done by the AI service
    // For now, return a placeholder
    return imageUrl; // In real implementation, this would be the heatmap overlay URL
  }

  private async processAIResponse(
    aiResponse: any, 
    scanType: string, 
    bodyPart: string, 
    gradCamUrl: string,
    processingTime: number
  ): Promise<DiagnosticResult> {
    
    const findings: MedicalFinding[] = aiResponse.predictions.map((pred: any) => ({
      condition: pred.condition,
      probability: pred.probability,
      location: pred.location,
      description: this.generateFindingDescription(pred),
      icd10Code: pred.icd10,
      urgency: this.determineUrgency(pred.condition, pred.probability)
    }));

    const severity = this.determineSeverity(findings);
    const recommendations = this.generateRecommendations(findings, severity);

    return {
      patientId: `PT-${Date.now()}`,
      scanType,
      bodyPart,
      findings,
      confidence: Math.round(aiResponse.overall_confidence * 100),
      severity,
      recommendations,
      gradCamUrl,
      processingTime,
      timestamp: new Date()
    };
  }

  private generateFindingDescription(prediction: any): string {
    const { condition, probability, location } = prediction;
    const confidenceText = probability > 0.8 ? 'highly suggestive of' : 
                          probability > 0.6 ? 'consistent with' : 'possible';
    
    return `Imaging findings are ${confidenceText} ${condition.toLowerCase()}${location ? ` in the ${location}` : ''}.`;
  }

  private determineUrgency(condition: string, probability: number): 'low' | 'medium' | 'high' | 'critical' {
    const criticalConditions = ['stroke', 'pneumothorax', 'aortic dissection', 'intracranial hemorrhage'];
    const highUrgencyConditions = ['pneumonia', 'pulmonary embolism', 'fracture'];
    
    const conditionLower = condition.toLowerCase();
    
    if (criticalConditions.some(c => conditionLower.includes(c)) && probability > 0.7) {
      return 'critical';
    }
    
    if (highUrgencyConditions.some(c => conditionLower.includes(c)) && probability > 0.6) {
      return 'high';
    }
    
    if (probability > 0.5) {
      return 'medium';
    }
    
    return 'low';
  }

  private determineSeverity(findings: MedicalFinding[]): 'normal' | 'mild' | 'moderate' | 'severe' | 'critical' {
    const maxUrgency = Math.max(...findings.map(f => {
      switch (f.urgency) {
        case 'critical': return 4;
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 0;
      }
    }));

    switch (maxUrgency) {
      case 4: return 'critical';
      case 3: return 'severe';
      case 2: return 'moderate';
      case 1: return 'mild';
      default: return 'normal';
    }
  }

  private generateRecommendations(findings: MedicalFinding[], severity: string): string[] {
    const recommendations: string[] = [];
    
    switch (severity) {
      case 'critical':
        recommendations.push('URGENT: Immediate medical attention required');
        recommendations.push('Contact emergency services or go to nearest emergency department');
        recommendations.push('Do not delay treatment');
        break;
      
      case 'severe':
        recommendations.push('Urgent medical evaluation recommended within 24 hours');
        recommendations.push('Contact primary care physician or specialist immediately');
        break;
      
      case 'moderate':
        recommendations.push('Medical evaluation recommended within 1-2 weeks');
        recommendations.push('Schedule appointment with appropriate specialist');
        break;
      
      case 'mild':
        recommendations.push('Follow-up with primary care physician');
        recommendations.push('Monitor symptoms and report changes');
        break;
      
      default:
        recommendations.push('No immediate action required');
        recommendations.push('Continue routine medical care as appropriate');
    }

    // Add specific recommendations based on findings
    findings.forEach(finding => {
      if (finding.condition.toLowerCase().includes('pneumonia')) {
        recommendations.push('Consider antibiotic therapy evaluation');
      }
      if (finding.condition.toLowerCase().includes('fracture')) {
        recommendations.push('Orthopedic consultation recommended');
      }
      if (finding.condition.toLowerCase().includes('stroke')) {
        recommendations.push('Neurological evaluation and stroke protocol activation');
      }
    });

    return recommendations;
  }
}

export const medicalAI = new MedicalAIService();