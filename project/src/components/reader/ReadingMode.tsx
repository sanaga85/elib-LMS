import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Maximize, 
  Minimize, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignJustify, 
  Bookmark, 
  Share2, 
  Download, 
  Minus, 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Palette, 
  Layers, 
  Sliders, 
  HelpCircle
} from 'lucide-react';

interface ReadingModeProps {
  content: string | React.ReactNode;
  title: string;
  resourceType: string;
  onClose: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onShare?: () => void;
  onDownload?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

interface ReadingSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  theme: 'light' | 'dark' | 'sepia';
  textAlign: 'left' | 'center' | 'justify';
  marginSize: number;
  highContrast: boolean;
}

const ReadingMode: React.FC<ReadingModeProps> = ({
  content,
  title,
  resourceType,
  onClose,
  onBookmark,
  isBookmarked = false,
  onShare,
  onDownload,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mouseIdle, setMouseIdle] = useState(false);
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 18,
    fontFamily: 'serif',
    lineHeight: 1.6,
    theme: 'light',
    textAlign: 'left',
    marginSize: 16,
    highContrast: false
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseIdleTimerRef = useRef<number | null>(null);
  
  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('reading-mode-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading reading settings:', error);
      }
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('reading-mode-settings', JSON.stringify(settings));
  }, [settings]);
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle mouse movement to show/hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      setMouseIdle(false);
      
      if (mouseIdleTimerRef.current) {
        window.clearTimeout(mouseIdleTimerRef.current);
      }
      
      mouseIdleTimerRef.current = window.setTimeout(() => {
        setMouseIdle(true);
        if (!showSettings && !showHelp) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseIdleTimerRef.current) {
        window.clearTimeout(mouseIdleTimerRef.current);
      }
    };
  }, [showSettings, showHelp]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case 'Escape':
          if (showSettings) {
            setShowSettings(false);
          } else if (showHelp) {
            setShowHelp(false);
          } else if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 's':
          setShowSettings(!showSettings);
          break;
        case 'h':
          setShowHelp(!showHelp);
          break;
        case 'ArrowLeft':
          if (onPageChange && currentPage > 1) {
            onPageChange(currentPage - 1);
          }
          break;
        case 'ArrowRight':
          if (onPageChange && currentPage < totalPages) {
            onPageChange(currentPage + 1);
          }
          break;
        case '+':
          setSettings(prev => ({
            ...prev,
            fontSize: Math.min(prev.fontSize + 1, 32)
          }));
          break;
        case '-':
          setSettings(prev => ({
            ...prev,
            fontSize: Math.max(prev.fontSize - 1, 12)
          }));
          break;
        case 'b':
          if (onBookmark) {
            onBookmark();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    onClose, 
    isFullscreen, 
    showSettings, 
    showHelp, 
    onPageChange, 
    currentPage, 
    totalPages, 
    onBookmark
  ]);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  const getThemeStyles = () => {
    switch (settings.theme) {
      case 'dark':
        return {
          backgroundColor: settings.highContrast ? '#000000' : '#1a1a1a',
          color: settings.highContrast ? '#ffffff' : '#e0e0e0',
        };
      case 'sepia':
        return {
          backgroundColor: '#f8f2e4',
          color: '#5b4636',
        };
      default: // light
        return {
          backgroundColor: settings.highContrast ? '#ffffff' : '#f9f9f9',
          color: settings.highContrast ? '#000000' : '#333333',
        };
    }
  };
  
  const getContentStyles = () => {
    return {
      fontSize: `${settings.fontSize}px`,
      fontFamily: settings.fontFamily,
      lineHeight: settings.lineHeight,
      textAlign: settings.textAlign,
      padding: `0 ${settings.marginSize}px`,
      maxWidth: '800px',
      margin: '0 auto',
      ...getThemeStyles()
    };
  };
  
  const renderPageControls = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange && currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange && currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    );
  };
  
  const renderSettingsPanel = () => {
    if (!showSettings) return null;
    
    return (
  <div className="absolute right-0 top-16 bg-white dark:bg-gray-800 shadow-lg rounded-l-lg p-4 w-72 z-50 border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-medium mb-4 flex items-center">
      <Settings className="mr-2" size={18} />
      Reading Settings
    </h3>
  </div> // ✅ This closing </div> was missing
);

        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Font Size</label>
            <div className="flex items-center">
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  fontSize: Math.max(prev.fontSize - 1, 12)
                }))}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Decrease font size"
              >
                <Minus size={16} />
              </button>
              <span className="mx-2 text-sm">{settings.fontSize}px</span>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  fontSize: Math.min(prev.fontSize + 1, 32)
                }))}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Increase font size"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Font Family</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                fontFamily: e.target.value
              }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans-serif</option>
              <option value="monospace">Monospace</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Helvetica Neue', sans-serif">Helvetica</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Line Height</label>
            <div className="flex items-center">
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  lineHeight: Math.max(prev.lineHeight - 0.1, 1.0)
                }))}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Decrease line height"
              >
                <Minus size={16} />
              </button>
              <span className="mx-2 text-sm">{settings.lineHeight.toFixed(1)}</span>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  lineHeight: Math.min(prev.lineHeight + 0.1, 3.0)
                }))}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Increase line height"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                className={`p-2 rounded-md flex-1 ${settings.theme === 'light' ? 'ring-2 ring-indigo-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                style={{ backgroundColor: '#f9f9f9', color: '#333' }}
              >
                <Sun size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'sepia' }))}
                className={`p-2 rounded-md flex-1 ${settings.theme === 'sepia' ? 'ring-2 ring-indigo-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                style={{ backgroundColor: '#f8f2e4', color: '#5b4636' }}
              >
                <Palette size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                className={`p-2 rounded-md flex-1 ${settings.theme === 'dark' ? 'ring-2 ring-indigo-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                style={{ backgroundColor: '#1a1a1a', color: '#e0e0e0' }}
              >
                <Moon size={16} className="mx-auto" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Text Alignment</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSettings(prev => ({ ...prev, textAlign: 'left' }))}
                className={`p-2 rounded-md flex-1 ${settings.textAlign === 'left' ? 'ring-2 ring-indigo-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <AlignLeft size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, textAlign: 'center' }))}
                className={`p-2 rounded-md flex-1 ${settings.textAlign === 'center' ? 'ring-2 ring-indigo-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <AlignCenter size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, textAlign: 'justify' }))}
                className={`p-2 rounded-md flex-1 ${settings.textAlign === 'justify' ? 'ring-2 ring-indigo-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <AlignJustify size={16} className="mx-auto" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Margin Size</label>
            <div className="flex items-center">
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  marginSize: Math.max(prev.marginSize - 8, 0)
                }))}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Decrease margins"
              >
                <Minus size={16} />
              </button>
              <span className="mx-2 text-sm">{settings.marginSize}px</span>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  marginSize: Math.min(prev.marginSize + 8, 64)
                }))}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Increase margins"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="high-contrast"
              checked={settings.highContrast}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                highContrast: e.target.checked
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="high-contrast" className="ml-2 block text-sm">
              High Contrast
            </label>
          </div>
          
          <button
            onClick={() => setSettings({
              fontSize: 18,
              fontFamily: 'serif',
              lineHeight: 1.6,
              theme: 'light',
              textAlign: 'left',
              marginSize: 16,
              highContrast: false
            })}
            className="w-full mt-2 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset to Defaults
          </button>
        </div>
  };
  
  const renderHelpPanel = () => {
    if (!showHelp) return null;
    
    return (
      <div className="absolute left-0 top-16 bg-white dark:bg-gray-800 shadow-lg rounded-r-lg p-4 w-72 z-50 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <HelpCircle className="mr-2" size={18} />
          Keyboard Shortcuts
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Exit Reading Mode</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Toggle Fullscreen</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">F</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Toggle Settings</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">S</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Toggle Help</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">H</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Previous Page</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">←</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Next Page</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">→</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Increase Font Size</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">+</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Decrease Font Size</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">-</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Toggle Bookmark</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">B</kbd>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col"
      style={getThemeStyles()}
    >
      {/* Top controls */}
      <div 
        className={`transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close reading mode"
            >
              <X size={20} />
            </button>
            <h2 className="ml-4 text-lg font-medium truncate">{title}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                showHelp ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
              aria-label="Help"
            >
              <HelpCircle size={20} />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                showSettings ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4" style={getContentStyles()}>
        {typeof content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          content
        )}
      </div>
      
      {/* Bottom controls */}
      <div 
        className={`transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                theme: prev.theme === 'light' ? 'dark' : prev.theme === 'dark' ? 'sepia' : 'light'
              }))}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {settings.theme === 'light' ? (
                <Sun size={20} />
              ) : settings.theme === 'dark' ? (
                <Moon size={20} />
              ) : (
                <Palette size={20} />
              )}
            </button>
            
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                fontSize: Math.max(prev.fontSize - 1, 12)
              }))}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Decrease font size"
            >
              <Type size={16} />
              <Minus size={12} className="absolute bottom-1 right-1" />
            </button>
            
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                fontSize: Math.min(prev.fontSize + 1, 32)
              }))}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative"
              aria-label="Increase font size"
            >
              <Type size={16} />
              <Plus size={12} className="absolute bottom-1 right-1" />
            </button>
          </div>
          
          {renderPageControls()}
          
          <div className="flex items-center space-x-2">
            {onBookmark && (
              <button
                onClick={onBookmark}
                className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  isBookmarked ? 'text-yellow-500' : ''
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark size={20} className={isBookmarked ? 'fill-current' : ''} />
              </button>
            )}
            
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Share"
              >
                <Share2 size={20} />
              </button>
            )}
            
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Download"
              >
                <Download size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Settings panel */}
      {renderSettingsPanel()}
      
      {/* Help panel */}
      {renderHelpPanel()}
    </div>
  );
};

export default ReadingMode;