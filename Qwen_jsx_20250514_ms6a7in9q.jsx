import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState('upload');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [showScrollCue, setShowScrollCue] = useState(true);
  
  // Document upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Analysis state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  
  // Payment state
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  
  // FAQ state
  const [openFAQ, setOpenFAQ] = useState(null);
  
  // Refs
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);
  
  // Mock data for testimonials and FAQ
  const testimonials = [
    {
      name: "Иван К.",
      initials: "ИК",
      rating: 5,
      text: "Точный прогноз - 68% шансов. Добился отмены решения!",
      category: "Гражданское дело"
    },
    {
      name: "Елена С.",
      initials: "ЕС",
      rating: 4.5,
      text: "Сэкономила кучу времени и нервов. Анализ помог понять, на каких моментах стоит сделать акцент в апелляции. Очень полезный сервис!",
      category: "Спор о защите прав потребителей"
    },
    {
      name: "Андрей М.",
      initials: "АМ",
      rating: 5,
      text: "Прогноз был верный. Решение не отменили, но существенно изменили, что для меня стало победой. Рекомендую!",
      category: "Трудовой спор"
    }
  ];
  
  const faqItems = [
    {
      question: "Как работает система оценки шансов?",
      answer: "Наша система использует технологии искусственного интеллекта и машинного обучения для анализа текста судебного решения. Алгоритм сопоставляет содержание вашего дела с тысячами других аналогичных решений и их апелляционных исходов из базы данных судебной практики."
    },
    {
      question: "Насколько точны результаты анализа?",
      answer: "Точность оценки составляет около 90%* по сравнению с заключениями профессиональных юристов. Однако важно понимать, что это только прогноз, а не гарантия результата. Окончательное решение зависит от многих факторов, включая аргументацию в апелляционной жалобе и конкретного состава суда."
    },
    {
      question: "Как обрабатываются мои данные?",
      answer: "Все загружаемые документы анализируются автоматически без участия человека. Мы не сохраняем полные тексты присланных решений - только ключевые параметры для статистики. Ваши персональные данные надежно защищены и не передаются третьим лицам."
    },
    {
      question: "Имеется ли регистрация данной системы?",
      answer: "Да. «Программный комплекс определения успешности апелляции по гражданским делам искового производства» имеет регистрацию в Роспатенте, номер регистрации 2024661583."
    }
  ];
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('Поддерживаются только PDF, DOCX и TXT файлы');
      return;
    }
    
    // Validate file size (max 30MB)
    if (file.size > 30 * 1024 * 1024) {
      alert('Максимальный размер файла: 30MB');
      return;
    }
    
    setUploadedFile(file);
    
    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // Handle file drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('Поддерживаются только PDF, DOCX и TXT файлы');
      return;
    }
    
    // Validate file size (max 30MB)
    if (file.size > 30 * 1024 * 1024) {
      alert('Максимальный размер файла: 30MB');
      return;
    }
    
    setUploadedFile(file);
    
    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };
  
  // Analyze document
  const analyzeDocument = () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowFullAnalysis(false);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          
          // Generate mock analysis result
          setTimeout(() => {
            setAnalysisResult({
              probability: Math.floor(Math.random() * 40) + 50, // Random between 50-90%
              title: "Высокие шансы на успешное обжалование",
              subtitle: "На основании анализа судебной практики и законодательства РФ",
              keyPoints: [
                "Нарушение норм процессуального права",
                "Неправильное применение материального права",
                "Недостаточная обоснованность выводов суда",
                "Наличие аналогичной судебной практики"
              ],
              recommendations: "Рекомендуется сосредоточить внимание на следующих моментах в апелляционной жалобе: детализировать нарушения процессуального законодательства, привести аргументы относительно неправильного применения материальных норм, запросить дополнительную экспертизу для подтверждения ваших доводов.",
              fullAnalysis: `Полный анализ включает в себя: 1. Проверка соблюдения норм процессуального права при вынесении решения. 2. Оценка правильности применения материальных норм законодательства. 3. Анализ логической обоснованности выводов суда. 4. Исследование аналогичной судебной практики. 5. Определение наиболее перспективных оснований для обжалования. 6. Разработка стратегии подачи апелляционной жалобы. 7. Прогнозирование возможных реакций суда на доводы жалобы.`
            });
          }, 1000);
          
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };
  
  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    // Simulate login
    setIsLoggedIn(true);
    setUser({ email });
    setActiveTab('upload');
    setConsentGiven(false);
  };
  
  // Handle registration
  const handleRegistration = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    // Simulate registration
    setIsLoggedIn(true);
    setUser({ email });
    setActiveTab('upload');
    setConsentGiven(false);
  };
  
  // Handle payment
  const handlePayment = () => {
    if (!consentGiven) {
      alert('Необходимо дать согласие на обработку персональных данных');
      return;
    }
    
    setIsPaying(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsPaying(false);
      setPaymentStatus('success');
      setShowFullAnalysis(true);
      
      // Scroll to results
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  };
  
  // Toggle FAQ
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
  // Handle cookie consent
  const acceptCookies = () => {
    setShowCookieConsent(false);
    localStorage.setItem('cookiesAccepted', 'true');
  };
  
  // Handle scroll cue
  const hideScrollCue = () => {
    setShowScrollCue(false);
  };
  
  // Handle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Check if cookies were already accepted
  useEffect(() => {
    if (localStorage.getItem('cookiesAccepted')) {
      setShowCookieConsent(false);
    }
  }, []);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll cue
      const scrollTop = window.scrollY;
      if (scrollTop > 100 && showScrollCue) {
        setShowScrollCue(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollCue]);
  
  // Mock preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('preloader')?.classList.add('hidden');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preloader */}
      <div id="preloader" className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
      
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-40 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/Logo_2.svg" 
              alt="Апелляционный помощник" 
              className="h-10 mr-3 cursor-pointer"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-800">
                <span className="block">Апелляционный</span>
                <span className="block ml-[4.3em] -mt-1">помощник</span>
              </h1>
            </div>
          </div>
          
          {/* Navigation and Partner Logo */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8" aria-label="Навигация">
              <a href="#benefits" className="text-gray-600 hover:text-indigo-600 transition-colors">Преимущества</a>
              <a href="#calculator" className="text-gray-600 hover:text-indigo-600 transition-colors">Проверка</a>
              <a href="#faq" className="text-gray-600 hover:text-indigo-600 transition-colors">Вопросы и ответы</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">Отзывы</a>
            </nav>
            
            {/* Partner Logo */}
            <a href="https://sk.ru/ " target="_blank" rel="noopener noreferrer" className="hidden md:block opacity-80 hover:opacity-100 transition-opacity">
              <img src="/Sk___.svg" alt="Партнер" className="h-8 w-auto" />
            </a>
          </div>
          
          {/* Mobile Menu and Actions */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Upload Button for Mobile */}
            {!isLoggedIn && activeTab === 'upload' && (
              <button 
                onClick={() => setActiveTab('upload')}
                className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                aria-label="Начать анализ"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            
            {/* Login Button for Mobile */}
            {!isLoggedIn && activeTab === 'login' && (
              <button 
                onClick={() => setActiveTab('login')}
                className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                aria-label="Войти"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            
            {/* Menu Toggle */}
            <button 
              onClick={toggleMobileMenu} 
              className="p-2 text-gray-600 hover:text-indigo-600"
              aria-label="Открыть меню"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-50">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-3">
                <a href="#benefits" className="text-gray-600 hover:text-indigo-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Преимущества</a>
                <a href="#calculator" className="text-gray-600 hover:text-indigo-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Проверка</a>
                <a href="#faq" className="text-gray-600 hover:text-indigo-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Вопросы и ответы</a>
                <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Отзывы</a>
                <a href="https://sk.ru/ " target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity py-2">
                  <img src="/Sk___.svg" alt="Партнер" className="h-6 w-auto" />
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section id="hero" className="bg-gradient-to-r from-indigo-100 to-blue-100 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl text-indigo-600 font-bold mb-6">Узнайте ваши шансы на успешную апелляцию</h2>
              <div className="space-y-2 mb-8">
                <p className="text-xl text-gray-700">AI-анализ судебных решений с точностью до 90%</p>
                <p className="text-lg text-gray-600">с использованием актуального законодательства</p>
                <p className="text-lg text-gray-600">и практики решений судов по всей России</p>
              </div>
              
              {!isLoggedIn ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setActiveTab('login')}
                    className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300 shadow-sm"
                  >
                    Войти
                  </button>
                  <button 
                    onClick={() => setActiveTab('register')}
                    className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm"
                  >
                    Зарегистрироваться
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-indigo-700 transition duration-300 inline-block animate-pulse"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Начать анализ
                </button>
              )}
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Профессиональный подход к анализу</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Актуальная правовая база</h3>
                <p className="text-gray-600 leading-relaxed">
                  Нейросеть обучена на постоянно обновляемых датасетах, включающих последние изменения 
                  законодательства РФ и текущие редакции нормативно-правовых актов
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white p-8 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Общероссийская судебная практика</h3>
                <p className="text-gray-600 leading-relaxed">
                  Анализ учитывает более 2 млн судебных решений из всех регионов страны, включая 
                  практику Верховного Суда и федеральных округов
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white p-8 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Интеграция с DeepSeek</h3>
                <p className="text-gray-600 leading-relaxed">
                  Используем мощь ИИ модели DeepSeek r1 через openrouter.ai для глубокого анализа 
                  судебных решений и прогнозирования исходов
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Calculator Section */}
        <section id="calculator" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {!isLoggedIn ? (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Войдите или зарегистрируйтесь</h2>
                  <p className="text-gray-600 mb-8">
                    Чтобы начать анализ судебного решения, пожалуйста, войдите в свой аккаунт 
                    или зарегистрируйтесь. Это обеспечит сохранность ваших данных и 
                    возможность оплаты за полный анализ.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setActiveTab('login')}
                      className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300 shadow-sm"
                    >
                      Войти
                    </button>
                    <button 
                      onClick={() => setActiveTab('register')}
                      className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm"
                    >
                      Зарегистрироваться
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Анализ перспектив апелляции</h2>
                  
                  {/* File Upload */}
                  <div className="mb-8">
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-4 transition-colors ${
                        isUploading ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                      }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      onClick={triggerFileInput}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <p className="text-gray-500">Перетащите сюда файл с решением суда или нажмите для выбора</p>
                      <p className="text-sm text-gray-400 mt-2">Максимальный размер файла: 30MB</p>
                      {isUploading && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{uploadProgress}% загружено</p>
                        </div>
                      )}
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden" 
                      accept=".pdf,.docx,.txt"
                    />
                    
                    {uploadedFile && (
                      <div className="bg-indigo-50 p-3 rounded-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span className="font-medium">{uploadedFile.name}</span>
                        <button 
                          type="button" 
                          onClick={removeFile} 
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Analyze Button */}
                  <button 
                    onClick={analyzeDocument}
                    disabled={!uploadedFile || isAnalyzing}
                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-6
                  0 flex items-center justify-center ${
                    isAnalyzing ? 'animate-pulse' : ''
                  }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Идет анализ...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Рассчитать вероятность отмены решения
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Results Section */}
        {analysisResult && (
          <section className="py-16 bg-white" ref={resultsRef}>
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Результаты анализа</h2>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Шансы на успешное обжалование</h3>
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3"
                        strokeDasharray={`${analysisResult.probability}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-800">{analysisResult.probability}%</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{analysisResult.title}</h4>
                  <p className="text-gray-600">{analysisResult.subtitle}</p>
                </div>
                
                <div className="bg-indigo-50 p-6 rounded-lg mb-8">
                  <h4 className="font-medium text-indigo-800 mb-3">Ключевые моменты для апелляции:</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {analysisResult.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h4 className="font-medium text-gray-800 mb-3">Рекомендации:</h4>
                  <p className="text-gray-700 mb-4">{analysisResult.recommendations}</p>
                  
                  {showFullAnalysis ? (
                    <div className="mt-4 text-gray-700">
                      <p>{analysisResult.fullAnalysis}</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-gray-700 mb-4">
                        Для просмотра полного анализа необходимо оплатить доступ. 
                        Вы увидите подробную информацию о:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                        <li>Проверке соблюдения норм процессуального права</li>
                        <li>Оценке правильности применения материальных норм законодательства</li>
                        <li>Анализе логической обоснованности выводов суда</li>
                        <li>Исследовании аналогичной судебной практики</li>
                        <li>Определении наиболее перспективных оснований для обжалования</li>
                      </ul>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                          <p className="text-yellow-800">
                            Первые несколько абзацев результата доступны бесплатно. Полный анализ открывается после оплаты.
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h5 className="font-bold text-lg mb-4">Стоимость доступа: 499 ₽</h5>
                        
                        <div className="mb-4">
                          <label className="flex items-start">
                            <input 
                              type="checkbox" 
                              checked={consentGiven}
                              onChange={() => setConsentGiven(!consentGiven)}
                              className="mr-2 mt-1"
                            />
                            <span className="text-sm text-gray-600">
                              Я согласен на обработку персональных данных в соответствии с 
                              <a href="#" className="text-indigo-600 hover:underline ml-1">Соглашением</a> 
                              и 
                              <a href="#" className="text-indigo-600 hover:underline ml-1">Публичной офертой</a>
                            </span>
                          </label>
                        </div>
                        
                        <button
                          onClick={handlePayment}
                          disabled={!consentGiven || isPaying}
                          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isPaying ? 'animate-pulse' : ''
                          }`}
                        >
                          {isPaying ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Обработка платежа...
                            </>
                          ) : (
                            'Оплатить доступ'
                          )}
                        </button>
                        
                        {paymentStatus === 'success' && (
                          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span>Оплата прошла успешно! Полный анализ доступен ниже.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => {
                      setActiveTab('upload');
                      setUploadedFile(null);
                      setAnalysisResult(null);
                      setShowFullAnalysis(false);
                      setConsentGiven(false);
                      setPaymentStatus(null);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300"
                  >
                    Загрузить новый документ
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Вопросы и ответы</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <button 
                    className="faq-toggle flex justify-between items-center w-full text-left"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h3 className="text-lg font-medium">{item.question}</h3>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 text-indigo-600 transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div 
                    className={`faq-content mt-2 text-gray-600 ${openFAQ === index ? 'block' : 'hidden'}`}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Отзывы клиентов</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-xl mr-3">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 ${i < Math.floor(testimonial.rating) ? 'fill-current' : i === Math.floor(testimonial.rating) && testimonial.rating % 1 !== 0 ? 'fill-current' : ''}`} 
                            viewBox="0 0 24 24" 
                            fill={i < Math.floor(testimonial.rating) ? "currentColor" : "none"} 
                            stroke={i === Math.floor(testimonial.rating) && testimonial.rating % 1 !== 0 ? "currentColor" : "none"}
                            strokeWidth={i === Math.floor(testimonial.rating) && testimonial.rating % 1 !== 0 ? "2" : "0"}
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.84L12 17.77 5.82 19.98 7 13.14 2 9.27l6.91-.99z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{testimonial.text}</p>
                  <div className="text-sm text-gray-400">{testimonial.category}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">3,500+</div>
                <div className="text-gray-600">Ежемесячных пользователей</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">89%</div>
                <div className="text-gray-600">Точность прогнозов*</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">4.8</div>
                <div className="text-gray-600">Средняя оценка</div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-500 italic">
                *Точность прогноза подтверждена тестированием на 15,000 реальных судебных дел
              </p>
            </div>
          </div>
        </section>
        
        {/* Login/Register Tabs */}
        {(activeTab === 'login' || activeTab === 'register') && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </h3>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Введите ваш email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                    <input 
                      type="password" 
                      id="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Введите ваш пароль"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                  >
                    Войти
                  </button>
                  
                  <p className="text-center text-sm text-gray-600">
                    Нет аккаунта?{' '}
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('register')}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegistration} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Введите ваш email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                    <input 
                      type="password" 
                      id="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Создайте пароль"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Повторите пароль</label>
                    <input 
                      type="password" 
                      id="confirm-password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Повторите пароль"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                  >
                    Зарегистрироваться
                  </button>
                  
                  <p className="text-center text-sm text-gray-600">
                    Уже есть аккаунт?{' '}
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('login')}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Войти
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Апелляционный помощник</h3>
              <p className="text-gray-400">Инновационный сервис оценки перспектив апелляции</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <ul className="space-y-2">
                <li><a href="#hero" className="text-gray-400 hover:text-white">Главная</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-white">Преимущества</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Отзывы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Правовая информация</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Конфиденциальность</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Условия использования</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="text-gray-400">predictdecision@mail.ru</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.12 2 15.38a1 1 0 0 1-1-.64v-2a9 9 0 0 1-6-7.93 3 3 0 0 1-.88-1.6 5.5 5.5 0 0 1 3-4.74V2a2 2 0 1 1 4 0v.1c.92.5 1.7 1.4 2 2.5 1.1 2.4 1.9 4.9 2.2 7.4.4 3.1-.4 6.1-1.7 9-.3.2-.5.4-.7.6z"></path>
                  </svg>
                  <span className="text-gray-400">8 (920) 418-54-54</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© ООО «НЕЙРОПРАВО», 2025. Все права защищены.</p>
          </div>
        </div>
      </footer>
      
      {/* Cookie Consent */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-4 px-4 md:px-8 z-50">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left text-sm">
              Используя наш сайт, вы соглашаетесь, что мы можем хранить куки (cookies) в вашем браузере для анализа работы сайта.
            </div>
            <button 
              onClick={acceptCookies}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-full whitespace-nowrap transition-colors"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
      
      {/* Scroll Cue */}
      {showScrollCue && (
        <div 
          className="fixed inset-x-0 bottom-2 z-50 opacity-0 transition-opacity duration-1000"
          onClick={hideScrollCue}
        >
          <div className="relative mx-auto w-20 h-10 flex items-center justify-center">
            <div className="absolute w-6 h-6 border-2 border-indigo-400/30 rounded-full animate-scroll-pulse"></div>
            <div className="w-3 h-3 bg-indigo-400/80 rounded-full animate-scroll-dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;