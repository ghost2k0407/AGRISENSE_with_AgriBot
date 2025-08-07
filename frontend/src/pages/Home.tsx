import { Leaf, MessageCircle, CheckCircle, Database, Award, ArrowRight, Sparkles } from 'lucide-react';
import homepaddy from "../assets/home-paddy.jpg"
export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img 
          src={homepaddy}
          alt="Rice field background"
          className="w-full h-full object-fill absolute"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.style.background = 'linear-gradient(50deg, #fef3c7 0%, #d9f99d 50%, #fef3c7 100%)';
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-green-900/30 to-yellow-800/40"></div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-green-400/40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-yellow-500/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-60 right-40 w-5 h-5 bg-green-500/30 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative z-20">
        {/* Sticky Navbar */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-yellow-200/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Brand */}
              <div className="flex items-center space-x-2 group">
                <div className="relative">
                  <Leaf className="h-8 w-8 text-yellow-600 group-hover:rotate-12 transition-transform duration-300" />
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-ping" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-green-600 to-yellow-500 bg-clip-text text-transparent">
                  AgriSense <span className="text-2xl">🌾</span>
                </span>
              </div>
              
              {/* Navigation Links */}
              <div className="flex items-center space-x-6">
                <a 
                  href="/diagnosis" 
                  className="group flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 hover:from-yellow-200 hover:to-yellow-100 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Leaf className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  <span className="font-semibold">LeafGuard</span>
                </a>
                <a 
                  href="/chatbot" 
                  className="group flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-100 to-green-50 text-green-800 hover:from-green-200 hover:to-green-100 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">AgriBot Pro</span>
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8 animate-fade-in-up">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-white">
                Welcome to{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-green-200 to-yellow-400 animate-gradient-x font-shadow-xlg">
                    AgriSense
                  </span>
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-green-400/20 blur-xl animate-pulse"></div>
                </span>{' '}
                <span className="text-5xl md:text-6xl animate-bounce inline-block">🌾</span>
              </h1>
            </div>
            
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed font-medium bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-500/50">
                Your AI-powered platform for diagnosing rice leaf diseases with precision 
                and getting expert agricultural advice tailored to your farming needs
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <a 
                href="/diagnosis" 
                className="group relative flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-green-500 text-white text-xl font-bold rounded-2xl hover:from-yellow-600 hover:via-yellow-700 hover:to-green-600 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 animate-pulse-slow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <Leaf className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Try LeafGuard</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform" />
              </a>
              
              <a 
                href="/chatbot" 
                className="group relative flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-green-500 via-green-600 to-yellow-500 text-white text-xl font-bold rounded-2xl hover:from-green-600 hover:via-green-700 hover:to-yellow-600 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 animate-pulse-slow" style={{animationDelay: '0.5s'}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <MessageCircle className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">Chat with AgriBot Pro</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 animate-fade-in-up">
              <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-green-300 to-yellow-300 bg-clip-text text-transparent mb-12 leading-tight px-4">
                Powered by Advanced AI Technology
              </h2>
              <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                Experience cutting-edge agricultural technology designed to enhance your farming productivity and crop health
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-16">
              {/* LeafGuard Feature */}
              <div className="group p-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl border-2 border-yellow-200/50 hover:border-yellow-300/70 transition-all duration-500 transform hover:scale-105 animate-slide-in-left">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300">
                    <Leaf className="h-10 w-10 text-yellow-700 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="h-4 w-4 text-yellow-500 animate-ping" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-700 to-yellow-600 bg-clip-text text-transparent">LeafGuard</h3>
                    <p className="text-yellow-700 font-semibold text-lg">Rice Leaf Disease Detection</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  Advanced Vision Transformer (ViT) model that diagnoses rice leaf diseases with 
                  exceptional accuracy. Upload a photo and get instant, reliable results.
                </p>
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-3 bg-yellow-50 px-4 py-2 rounded-full">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-700">98% Accuracy</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-bold text-green-700">Instant Results</span>
                  </div>
                </div>
                
                <a 
                  href="/diagnosis" 
                  className="group/link inline-flex items-center space-x-2 text-yellow-700 font-bold hover:text-yellow-800 bg-yellow-100 hover:bg-yellow-200 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <span>Try LeafGuard</span>
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-2 transition-transform" />
                </a>
              </div>

              {/* AgriBot Pro Feature */}
              <div className="group p-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl border-2 border-green-200/50 hover:border-green-300/70 transition-all duration-500 transform hover:scale-105 animate-slide-in-right">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                    <MessageCircle className="h-10 w-10 text-green-700 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="h-4 w-4 text-green-500 animate-ping" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">AgriBot Pro</h3>
                    <p className="text-green-700 font-semibold text-lg">AI Agricultural Assistant</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  Specialized agricultural chatbot powered by Gemini 2.5 Pro, trained exclusively 
                  on farming knowledge to provide expert advice and solutions.
                </p>
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-3 bg-yellow-50 px-4 py-2 rounded-full">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-700">Gemini 2.5 Pro</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-bold text-green-700">24/7 Available</span>
                  </div>
                </div>
                
                <a 
                  href="/chatbot" 
                  className="group/link inline-flex items-center space-x-2 text-green-700 font-bold hover:text-green-800 bg-green-100 hover:bg-green-200 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <span>Chat with AgriBot Pro</span>
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-2 transition-transform" />
                </a>
              </div>
            </div>

            {/* Stats Section */}
            <div className="relative bg-gradient-to-r from-yellow-500 via-yellow-600 via-green-600 to-green-500 rounded-3xl p-12 text-white text-center shadow-2xl transform hover:scale-105 transition-all duration-500 animate-fade-in-up overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-400/20 animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Database className="h-10 w-10 animate-bounce" />
                  <h3 className="text-3xl font-bold">Trained on Extensive Dataset</h3>
                </div>
                <p className="text-2xl text-yellow-100 mb-4">
                  <span className="text-5xl font-bold text-white animate-pulse">2000+</span> Expert-Labeled Images
                </p>
                <p className="text-xl text-yellow-100 font-medium">
                  Covering multiple rice leaf disease categories for comprehensive diagnosis
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 mt-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-white/95 to-yellow-50/90 backdrop-blur-sm border-t border-yellow-200/50">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6 group">
              <div className="relative">
                <Leaf className="h-8 w-8 text-yellow-600 group-hover:rotate-12 transition-transform duration-300" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-ping" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-green-600 to-yellow-500 bg-clip-text text-transparent">
                AgriSense 🌾
              </span>
            </div>
            <p className="text-lg text-gray-700 font-medium">
              Empowering farmers with AI-driven agricultural solutions
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(234, 179, 8, 0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }
      `}</style>
    </div>
  );
}