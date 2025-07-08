// src/components/ScanUploader.tsx
function ScanUploader() {
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    // Validate first
    const validation = await customClient.validateScan(file);
    
    if (!validation.isValid) {
      setError(validation.error || 'Not a valid medical scan');
      return;
    }

    // Proceed with analysis
    const results = await customClient.analyzeScan(file, validation.scanType!);
    // ... display results ...
  };

  return (
    <div>
      <input type="file" onChange={e => handleUpload(e.target.files![0])} />
      {error && <div className="error-banner">{error}</div>}
    </div>
  );
}