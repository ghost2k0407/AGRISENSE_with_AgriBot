import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Camera, 
  Globe, 
  Zap,
  Shield,
  Brain,
  Download,
  Share2,
  RotateCcw,
  AlertTriangle,
  Leaf,
  Bug,
  Eye,
  BookOpen
} from 'lucide-react';

// API function for disease classification
const classifyImage = async (formData: FormData) => {
  try {
    console.log('Making API call to classify image...');
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch('http://localhost:8000/classify/', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API Success Response:', result);
    return result;
    
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
};

// Enhanced Doughnut Chart Component with Animation
const DoughnutChart = ({ confidence }: { confidence: number }) => {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(confidence);
    }, 300);
    return () => clearTimeout(timer);
  }, [confidence]);

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(animatedConfidence / 100) * circumference} ${circumference}`;
  
  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-500';
    if (conf >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceText = (conf: number) => {
    if (conf >= 90) return 'Excellent';
    if (conf >= 80) return 'Very Good';
    if (conf >= 70) return 'Good';
    if (conf >= 60) return 'Moderate';
    return 'Low';
  };
  
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          className={getConfidenceColor(animatedConfidence)}
          style={{
            transition: 'stroke-dasharray 1.5s ease-in-out',
            strokeLinecap: 'round'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${getConfidenceColor(animatedConfidence).replace('text-', 'text-')}`}>
          {Math.round(animatedConfidence)}%
        </span>
        <span className="text-sm text-gray-600 mt-1">
          {getConfidenceText(animatedConfidence)}
        </span>
      </div>
    </div>
  );
};

// Enhanced Markdown Renderer with better formatting
const MarkdownRenderer = ({ content }: { content: string }) => {
  const cleanMarkdown = (text: string) => {
    return text
      .replace(/#{1,6}\s*/g, '') // Remove # markdown headers
      .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1') // Remove ** bold markers
      .replace(/_{1,2}(.*?)_{1,2}/g, '$1') // Remove __ underline markers
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove ``` code markers
      .trim();
  };

  const renderMarkdown = (text: string) => {
    const cleanedText = cleanMarkdown(text);
    const sections = cleanedText.split(/(?=\b(?:Cause|Symptoms?|Solutions?|Treatments?|Prevention|Recommendations?|Description)\b)/i)
      .filter(section => section.trim().length > 0);
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim().length > 0);
      if (lines.length === 0) return null;

      const firstLine = lines[0].trim();
      const isHeader = /^(Cause|Symptoms?|Solutions?|Treatments?|Prevention|Recommendations?|Description)$/i.test(firstLine);
      
      if (isHeader) {
        const headerText = firstLine;
        const content = lines.slice(1);
        
        const getHeaderIcon = (header: string) => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('cause')) return <Bug className="w-5 h-5" />;
          if (lowerHeader.includes('symptom')) return <Eye className="w-5 h-5" />;
          if (lowerHeader.includes('solution') || lowerHeader.includes('treatment')) return <Shield className="w-5 h-5" />;
          if (lowerHeader.includes('prevention')) return <Leaf className="w-5 h-5" />;
          return <BookOpen className="w-5 h-5" />;
        };

        return (
          <div key={index} className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-600 text-white rounded-lg">
                {getHeaderIcon(headerText)}
              </div>
              <h3 className="text-xl font-bold text-green-800">
                {headerText}
              </h3>
            </div>
            <div className="space-y-3 ml-11">
              {content.map((line, lineIndex) => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
                  return (
                    <div key={lineIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        {trimmedLine.replace(/^[-•]\s*/, '')}
                      </p>
                    </div>
                  );
                } else if (trimmedLine.length > 0) {
                  return (
                    <p key={lineIndex} className="text-gray-700 leading-relaxed">
                      {trimmedLine}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );
      } else {
        // Handle content without clear headers
        return (
          <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
            {lines.map((line, lineIndex) => (
              <p key={lineIndex} className="text-gray-700 leading-relaxed mb-2">
                {line.trim()}
              </p>
            ))}
          </div>
        );
      }
    }).filter(Boolean);
  };

  return (
    <div className="space-y-4">
      {renderMarkdown(content)}
    </div>
  );
};

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <AlertTriangle className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${colors[type]} shadow-lg animate-in slide-in-from-right-5`}>
      <div className="flex items-center gap-2">
        {icons[type]}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          ×
        </button>
      </div>
    </div>
  );
};


const LeafGuardDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English'},
    { code: 'ta', name: 'தமிழ்'},
    { code: 'te', name: 'తెలుగు'},
    { code: 'kn', name: 'ಕನ್ನಡ'},
    { code: 'ml', name: 'മലയാളം'}
  ];

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast('File size must be less than 10MB', 'error');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      showToast('Image uploaded successfully!', 'success');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      showToast('Please select an image file', 'error');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file');
      showToast('Please select a valid image file', 'error');
      return;
    }

    console.log('Starting image classification...');
    console.log('Selected file:', selectedFile);
    console.log('Selected language:', selectedLanguage);

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('language', selectedLanguage);
      
      console.log('Calling API...');
      const res = await classifyImage(formData);
      console.log('API call successful:', res);
      setResult(res);
      showToast('Analysis completed successfully!', 'success');
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
      
    } catch (err: any) {
      console.error('Classification error details:', err);
      const errorMessage = `Failed to analyze the image: ${err.message || 'Unknown error'}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      showToast('Image uploaded successfully!', 'success');
    } else {
      showToast('Please drop a valid image file', 'error');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadReport = () => {
    if (!result) return;
    
    const reportContent = `
LeafGuard Disease Diagnosis Report
================================

Disease: ${result.prediction.label}
Confidence: ${result.prediction.confidence}%
Language: ${selectedLanguage}
Generated: ${new Date().toLocaleString()}

Recommendations:
${result.recommendation}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leafguard-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report downloaded successfully!', 'success');
  };

  const shareResults = async () => {
    if (!result) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LeafGuard Disease Diagnosis',
          text: `Disease identified: ${result.prediction.label} (${result.prediction.confidence}% confidence)`,
          url: window.location.href
        });
        showToast('Results shared successfully!', 'success');
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback - copy to clipboard
      const shareText = `LeafGuard Diagnosis: ${result.prediction.label} (${result.prediction.confidence}% confidence)`;
      navigator.clipboard.writeText(shareText);
      showToast('Results copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast}
        />
      )}

      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-green-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Brain className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  LeafGuard AI
                </h1>
                <p className="text-gray-600 text-lg">Intelligent Rice Disease Detection System</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Upload Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
              <Camera className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Upload Plant Image
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get instant AI-powered disease identification with personalized treatment recommendations 
              in your preferred language
            </p>
          </div>

          <div className="space-y-8">
            {/* Enhanced File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                isDragActive
                  ? 'border-green-400 bg-green-50 scale-105 shadow-lg'
                  : selectedFile 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="space-y-6">
                  <div className="relative inline-block">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-w-sm max-h-64 mx-auto rounded-xl shadow-lg border-4 border-white"
                    />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-green-600 font-semibold text-lg mb-2">
                      {selectedFile?.name}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetForm();
                      }}
                      className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Change image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <Upload className={`w-16 h-16 mx-auto transition-colors ${
                      isDragActive ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    {isDragActive && (
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      {isDragActive ? 'Drop your image here' : 'Drop your leaf image here'}
                    </p>
                    <p className="text-gray-500 mb-4">
                      or click to browse files from your device
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">PNG</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">JPG</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">JPEG</span>
                    <span className="text-gray-300">•</span>
                    <span>Max 10MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Language Selection */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <label htmlFor="language" className="font-semibold text-lg">
                    Select Language:
                  </label>
                </div>
                <select
                  id="language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm text-lg font-medium min-w-48"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e as React.FormEvent)}
              disabled={!selectedFile || isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Analyzing Image...</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6" />
                  <span>Diagnose with AI</span>
                  <Zap className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-3 p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Analysis Failed</h4>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Results Section */}
        {result && (
          <div ref={resultRef} className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-5 duration-700">

            {/* Enhanced Disease Prediction */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
                  <Bug className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Disease Diagnosis Results
                </h2>
                <p className="text-gray-600">AI-powered analysis completed successfully</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center space-y-6">
                  <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      Disease Identified
                    </h3>
                    <div className="text-4xl font-bold text-green-700 mb-4 leading-tight">
                      {result.prediction.label}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Confirmed Detection
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Confidence Analysis</h4>
                    <DoughnutChart confidence={Math.round(parseFloat(result.prediction.confidence))} />
                    <div className="text-center space-y-2">
                      <p className="text-gray-600">
                        Analysis completed successfully
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">

                  
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          Analysis Complete
                        </h4>
                        <p className="text-green-700 text-sm leading-relaxed">
                          Your plant image has been successfully analyzed. The AI detected 
                          <span className="font-semibold"> {result.prediction.label}</span> with 
                          <span className="font-semibold"> {Math.round(parseFloat(result.prediction.confidence))}% confidence</span>. 
                          Detailed treatment recommendations are provided below.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={downloadReport}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                    <button 
                      onClick={shareResults}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Results
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Similar Images */}
            {result.similar_images && result.similar_images.length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Similar Disease Cases
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Reference images showing similar symptoms and disease patterns
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {result.similar_images.map((imgUrl: string, index: number) => (
                    <div key={index} className="group relative">
                      <div className="relative overflow-hidden rounded-xl shadow-md bg-gray-100 aspect-square">
                        <img
                          src={imgUrl}
                          alt={`Similar case ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/200x200/10b981/ffffff?text=Case+${index + 1}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-2 left-2 right-2 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Reference #{index + 1}
                        </div>
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1">
                          <span className="text-xs font-bold text-gray-700">#{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                

              </div>
            )}

            {/* Enhanced Recommendations */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Treatment Recommendations
                </h2>
                <p className="text-gray-600 text-lg">
                  Comprehensive guidance for treating {result.prediction.label}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-600 text-white rounded-xl">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Personalized Treatment Plan
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-green max-w-none">
                <MarkdownRenderer content={result.recommendation} />
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={downloadReport}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Download className="w-5 h-5" />
                    Save Full Report
                  </button>
                  <button 
                    onClick={shareResults}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Diagnosis
                  </button>
                  <button 
                    onClick={() => {
                      resetForm();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    New Analysis
                  </button>
                </div>
              </div>
            </div>


          </div>
        )}
      </div>
      

    </div>
  );
};

export default LeafGuardDiagnosis;