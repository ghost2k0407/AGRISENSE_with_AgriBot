import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  BookOpen,
  History,
  Calendar,
  Trash2,
  Filter,
  Search,
  ExternalLink,
  Thermometer,
  Wind,
  FlaskConical,
  Activity,
  Target,
  Info
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
    // If confidence is between 0 and 1, multiply by 100
    const normalizedConfidence = confidence <= 1 ? confidence * 100 : confidence;
    setAnimatedConfidence(normalizedConfidence);
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

// Enhanced Markdown Renderer with structured cards using ReactMarkdown
const MarkdownRenderer = ({ content }: { content: string }) => {
  const parseStructuredContent = (text: string) => {
    // Clean the content first
    const cleanedText = text.replace(/^"+|"+$/g, '').replace(/\\n/g, '\n');
    
    // Split by main sections (### headers)
    const sections = cleanedText.split(/(?=### \d+\.)/);
    
    return sections.filter(section => section.trim().length > 0).map(section => {
      const lines = section.split('\n').filter(line => line.trim().length > 0);
      
      // Extract section number and title
      const headerMatch = lines[0].match(/### (\d+)\.\s*(.+)/);
      if (!headerMatch) return null;
      
      const sectionNumber = headerMatch[1];
      const sectionTitle = headerMatch[2];
      
      // Parse content based on section type
      const contentLines = lines.slice(1);
      const parsedContent = parseContentBySection(contentLines, sectionNumber);
      
      return {
        number: sectionNumber,
        title: sectionTitle,
        content: parsedContent
      };
    }).filter(Boolean);
  };

  const parseContentBySection = (lines: string[], sectionNumber: string) => {
    const content: any = {};
    let currentSubsection = '';
    let currentItems: string[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Check for subsection headers (bold text with **)
      if (trimmed.match(/^\*\*(.+):\*\*/)) {
        // Save previous subsection
        if (currentSubsection && currentItems.length > 0) {
          content[currentSubsection] = currentItems;
        }
        
        // Start new subsection
        currentSubsection = trimmed.replace(/^\*\*(.+):\*\*/, '$1');
        currentItems = [];
      }
      // Check for bullet points
      else if (trimmed.startsWith('*   ')) {
        currentItems.push(trimmed.replace(/^\*\s+/, ''));
      }
      // Regular content
      else if (trimmed.length > 0 && !trimmed.startsWith('###')) {
        if (!currentSubsection) {
          currentSubsection = 'description';
        }
        currentItems.push(trimmed);
      }
    });
    
    // Save the last subsection
    if (currentSubsection && currentItems.length > 0) {
      content[currentSubsection] = currentItems;
    }
    
    return content;
  };

  const getSectionIcon = (sectionNumber: string, subsectionKey: string = '') => {
    switch (sectionNumber) {
      case '1': // Disease Name and Symptoms
        if (subsectionKey.toLowerCase().includes('disease')) return <Bug className="w-5 h-5" />;
        if (subsectionKey.toLowerCase().includes('symptom')) return <Eye className="w-5 h-5" />;
        return <Info className="w-5 h-5" />;
      case '2': // Treatments
        if (subsectionKey.toLowerCase().includes('chemical')) return <FlaskConical className="w-5 h-5" />;
        if (subsectionKey.toLowerCase().includes('organic')) return <Leaf className="w-5 h-5" />;
        return <Shield className="w-5 h-5" />;
      case '3': // Prevention
        return <Target className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getSectionColor = (sectionNumber: string) => {
    switch (sectionNumber) {
      case '1':
        return 'from-red-50 to-pink-50 border-red-200';
      case '2':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case '3':
        return 'from-green-50 to-emerald-50 border-green-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getSectionHeaderColor = (sectionNumber: string) => {
    switch (sectionNumber) {
      case '1':
        return 'bg-red-600 text-white';
      case '2':
        return 'bg-blue-600 text-white';
      case '3':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const renderSubsectionCard = (key: string, items: string[], sectionNumber: string) => {
    const markdownContent = items.join('\n\n');
    
    return (
      <div key={key} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 ${getSectionHeaderColor(sectionNumber)} rounded-lg`}>
            {getSectionIcon(sectionNumber, key)}
          </div>
          <h4 className="text-lg font-semibold text-gray-800 capitalize">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </h4>
        </div>
        <div className="ml-11 prose prose-sm prose-gray max-w-none">
          <ReactMarkdown 
            components={{
              p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-2">{children}</p>,
              ul: ({ children }) => <ul className="space-y-2 list-none pl-0">{children}</ul>,
              li: ({ children }) => (
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed text-sm">{children}</span>
                </li>
              ),
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-800">{children}</em>
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  const sections = parseStructuredContent(content);
  
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.number} className={`bg-gradient-to-r ${getSectionColor(section.number)} rounded-2xl border-2 p-6 shadow-lg`}>
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 ${getSectionHeaderColor(section.number)} rounded-xl shadow-md`}>
              {getSectionIcon(section.number)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Section {section.number}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {section.title}
              </h3>
            </div>
          </div>

          {/* Section Content */}
          <div className="grid gap-4">
            {Object.entries(section.content).map(([key, items]) => 
              renderSubsectionCard(key, items as string[], section.number)
            )}
          </div>
        </div>
      ))}
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

// History Item Component
const HistoryItem = ({ diagnosis, onDelete, onViewDetails }: { 
  diagnosis: any; 
  onDelete: (id: string) => void; 
  onViewDetails: (diagnosis: any) => void;
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bug className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {diagnosis.prediction.label}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(Math.round(parseFloat(diagnosis.prediction.confidence)))}`}>
              {Math.round(parseFloat(diagnosis.prediction.confidence))}%
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(diagnosis.timestamp)}
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {diagnosis.language}
            </div>
          </div>

          {diagnosis.imagePreview && (
            <div className="relative inline-block">
              <img 
                src={diagnosis.imagePreview} 
                alt="Diagnosis preview" 
                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-100"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onViewDetails(diagnosis)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(diagnosis.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {diagnosis.recommendation.slice(0, 120)}...
        </p>
      </div>
    </div>
  );
};

// History Modal Component
const HistoryModal = ({ isOpen, onClose, selectedDiagnosis }: {
  isOpen: boolean;
  onClose: () => void;
  selectedDiagnosis: any;
}) => {
  if (!isOpen || !selectedDiagnosis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Diagnosis Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 text-gray-500">✕</div>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              {selectedDiagnosis.imagePreview && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Original Image</h3>
                  <img 
                    src={selectedDiagnosis.imagePreview} 
                    alt="Diagnosis image" 
                    className="w-full h-64 object-cover rounded-xl border"
                  />
                </div>
              )}
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Disease Information
                </h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Disease:</span> {selectedDiagnosis.prediction.label}</p>
                  <p><span className="font-medium">Confidence:</span> {Math.round(parseFloat(selectedDiagnosis.prediction.confidence))}%</p>
                  <p><span className="font-medium">Language:</span> {selectedDiagnosis.language}</p>
                  <p><span className="font-medium">Date:</span> {new Date(selectedDiagnosis.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Confidence Score</h3>
                <DoughnutChart confidence={Math.round(parseFloat(selectedDiagnosis.prediction.confidence))} />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Treatment Recommendations</h3>
            <MarkdownRenderer content={selectedDiagnosis.recommendation} />
          </div>
        </div>
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
  const [currentTab, setCurrentTab] = useState<'diagnosis' | 'history'>('diagnosis');
  
  // History states
  const [diagnosisHistory, setDiagnosisHistory] = useState<any[]>([]);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English'},
    { code: 'ta', name: 'தமிழ்'},
    { code: 'te', name: 'తెలుగు'},
    { code: 'kn', name: 'ಕನ್ನಡ'},
    { code: 'ml', name: 'മലയാളം'}
  ];
  
  // Save diagnosis to history
  const saveDiagnosisToHistory = useCallback((diagnosisResult: any, imageFile: File, language: string) => {
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      prediction: diagnosisResult.prediction,
      recommendation: diagnosisResult.recommendation,
      similar_images: diagnosisResult.similar_images || [],
      language: languages.find(lang => lang.code === language)?.name || 'English',
      imagePreview: URL.createObjectURL(imageFile),
      fileName: imageFile.name
    };

    const updatedHistory = [historyItem, ...diagnosisHistory].slice(0, 50); // Keep only last 50 diagnoses
    setDiagnosisHistory(updatedHistory);
  }, [diagnosisHistory, languages]);

  // Filter and search history
  const filteredHistory = diagnosisHistory.filter(diagnosis => {
    const matchesSearch = diagnosis.prediction.label.toLowerCase().includes(historySearch.toLowerCase()) ||
                         diagnosis.fileName.toLowerCase().includes(historySearch.toLowerCase());
    
    if (historyFilter === 'all') return matchesSearch;
    
    const confidence = Math.round(parseFloat(diagnosis.prediction.confidence));
    if (historyFilter === 'high') return matchesSearch && confidence >= 80;
    if (historyFilter === 'medium') return matchesSearch && confidence >= 60 && confidence < 80;
    if (historyFilter === 'low') return matchesSearch && confidence < 60;
    
    return matchesSearch;
  });

  const deleteHistoryItem = useCallback((id: string) => {
    const updatedHistory = diagnosisHistory.filter(item => item.id !== id);
    setDiagnosisHistory(updatedHistory);
    showToast('Diagnosis deleted from history', 'success');
  }, [diagnosisHistory]);

  const viewHistoryDetails = useCallback((diagnosis: any) => {
    setSelectedHistoryItem(diagnosis);
    setShowHistoryModal(true);
  }, []);

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
      
      // Save to history
      saveDiagnosisToHistory(res, selectedFile, selectedLanguage);
      
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

      {/* History Modal */}
      <HistoryModal 
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        selectedDiagnosis={selectedHistoryItem}
      />

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

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setCurrentTab('diagnosis')}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentTab === 'diagnosis' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Brain className="w-4 h-4" />
                New Diagnosis
              </button>
              <button
                onClick={() => setCurrentTab('history')}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentTab === 'history' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <History className="w-4 h-4" />
                History ({diagnosisHistory.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentTab === 'diagnosis' ? (
          <>
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
                        <DoughnutChart confidence={Math.round(parseFloat(result.prediction.confidence) * (parseFloat(result.prediction.confidence) <= 1 ? 100 : 1))} />
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
                              <span className="font-semibold"> {Math.round(parseFloat(result.prediction.confidence) * (parseFloat(result.prediction.confidence) <= 1 ? 100 : 1))}% confidence</span>. 
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

                {/* Enhanced Recommendations with new markdown renderer */}
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
                        <p className="text-green-700">
                          Detailed recommendations based on AI analysis and expert knowledge
                        </p>
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
          </>
        ) : (
          /* History Tab */
          <div className="space-y-8">
            {/* History Header and Controls */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                  <History className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Diagnosis History
                </h2>
                <p className="text-gray-600 text-lg">
                  View and manage your previous plant disease diagnoses
                </p>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by disease name or file name..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Filter className="w-5 h-5" />
                    <label className="font-medium">Filter:</label>
                  </div>
                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-lg font-medium min-w-40"
                  >
                    <option value="all">All Results</option>
                    <option value="high">High Confidence (≥80%)</option>
                    <option value="medium">Medium Confidence (60-79%)</option>
                    <option value="low">Low Confidence (&lt;60%)</option>
                  </select>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {diagnosisHistory.length}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">
                    Total Diagnoses
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-100">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {diagnosisHistory.filter(d => Math.round(parseFloat(d.prediction.confidence)) >= 80).length}
                  </div>
                  <div className="text-sm text-green-700 font-medium">
                    High Confidence
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 text-center border border-yellow-100">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {diagnosisHistory.filter(d => {
                      const conf = Math.round(parseFloat(d.prediction.confidence));
                      return conf >= 60 && conf < 80;
                    }).length}
                  </div>
                  <div className="text-sm text-yellow-700 font-medium">
                    Medium Confidence
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 text-center border border-red-100">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {diagnosisHistory.filter(d => Math.round(parseFloat(d.prediction.confidence)) < 60).length}
                  </div>
                  <div className="text-sm text-red-700 font-medium">
                    Low Confidence
                  </div>
                </div>
              </div>
            </div>

            {/* History Items */}
            {filteredHistory.length > 0 ? (
              <div className="grid gap-6">
                {filteredHistory.map((diagnosis) => (
                  <HistoryItem
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    onDelete={deleteHistoryItem}
                    onViewDetails={viewHistoryDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <History className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {diagnosisHistory.length === 0 ? 'No Diagnoses Yet' : 'No Results Found'}
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  {diagnosisHistory.length === 0 
                    ? 'Start by uploading and analyzing your first plant image to build your diagnosis history.' 
                    : 'Try adjusting your search terms or filter settings to find what you\'re looking for.'
                  }
                </p>
                {diagnosisHistory.length === 0 && (
                  <button
                    onClick={() => setCurrentTab('diagnosis')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Brain className="w-5 h-5" />
                    Start First Diagnosis
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeafGuardDiagnosis;