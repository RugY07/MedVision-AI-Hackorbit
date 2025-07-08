// Pre-trained model for scan detection (3MB)
const MODEL_URL = 'https://tfhub.dev/healthcare/image-validator/1';

export async function extractMedicalFeatures(img: HTMLImageElement) {
  // Load TensorFlow.js model
  const model = await tf.loadGraphModel(MODEL_URL);
  
  // Preprocess
  const tensor = tf.browser.fromPixels(img)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();
  
  // Predict
  const prediction = model.predict(tensor) as tf.Tensor;
  const [isMedical, scanType] = prediction.dataSync();

  return {
    isMedicalImage: isMedical > 0.85, // Confidence threshold
    likelyScanType: ['xray', 'mri', 'ct'][scanType] as 'xray'|'mri'|'ct'
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => resolve(img);
  });
}