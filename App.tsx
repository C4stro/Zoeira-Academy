import { useState, useEffect, useRef } from 'react';
import { generateCourseContent, generateAbsurdQuote } from './services/geminiService';
import { Course } from './types';
import { CourseCard } from './components/CourseCard';
import { Button } from './components/Button';
import { Sparkles, BrainCircuit, Dices, Loader2, Zap, Coffee, Copy, Check, Heart, History, RotateCcw, Trash2, GraduationCap, ArrowRight, Share2, Quote, Camera, MessageCircle, Twitter, Link as LinkIcon } from 'lucide-react';

const ABSURD_TOPICS = [
  // Clássicos
  "Como convencer seu gato a pagar metade do aluguel",
  "Mestrado em Fofoca de Bairro e Investigação Digital",
  "Técnicas avançadas para dobrar lençol de elástico com a força da mente",
  "Como ficar milionário vendendo ar engarrafado gourmet",
  "Doutorado em responder 'Vou ver e te aviso' sem culpa",
  "Sobrevivência em Grupo de Família do WhatsApp: Módulo Avançado",
  
  // Coach & Mindset
  "Mindset de Tubarão em Aquário de Peixe Beta: Pense Pequeno",
  "Desbloqueio Mental para aceitar que a culpa é do Signo",
  "Como vibrar na frequência da Riqueza Quântica devendo no Serasa",
  "Reprogramação de DNA para nascer herdeiro na próxima vida",
  "Coach de Fracasso: Como desistir antes mesmo de tentar",
  "Como transformar sua preguiça em 'Lifestyle Slow Living'",
  "A Arte de parecer ocupado no trabalho alternando Abas do Excel",
  "Hipnose para convencer o chefe de que você merece aumento (sem trabalhar)",
  "Como ser um Macho Alfa sendo sustentado pela Avó",
  "O Segredo: Como atrair dinheiro pensando forte (enquanto dorme)",

  // Marketing Digital & Business
  "Como vender Curso de como vender Curso de como vender Curso",
  "Dropshipping de Gelo para Esquimós: O Oceano Azul",
  "Day Trade de Figurinhas da Copa de 2014",
  "NFT de Boleto Pago: A nova arte digital",
  "Marketing Digital para Pombos: O nicho inexplorado",
  "Como criar um esquema de pirâmide baseado em abraços virtuais",
  "Linkedin Top Voice: Como escrever textão sobre demitir a própria mãe",
  "Como convencer o Agiota a investir no seu Mindset",
  "Gestão de Crise: O que fazer quando a mãe conta até três",

  // Life Hacks Bizarros
  "Workshop de Fotossíntese Humana: Vivendo de Luz e Boletos",
  "Dieta da Ansiedade: Perca peso roendo as unhas",
  "Como pilotar nave alienígena sem carteira de motorista",
  "Feng Shui de Gaveta de Cabos Embolados",
  "Interpretação de sonhos de Eletrodomésticos (A Geladeira fala?)",
  "Técnicas de Invisibilidade para evitar vizinhos no elevador",
  "Como ganhar discussões imaginárias no chuveiro (Nível Hard)",
  "Culinária Molecular para fazer Miojo Gourmet de R$ 300,00",
  "Sommelier de Água da Torneira: Identifique o terroir do cano",
  "Como treinar sua barata para buscar o controle remoto",
  "Telepatia para chamar o garçom quando ele te ignora",
  "Como ler livros por osmose (dormindo em cima deles)",
  "Meditação Transcendental para aguentar áudio de 5 minutos",
  "Yoga Facial para parecer interessado em reuniões chatas",
  
  // Tecnologia & Paranormal
  "Como hackear o universo usando HTML básico",
  "Consultoria Amorosa com ChatGPT: Como ser romântico com IA",
  "Como minerar Bitcoin usando calculadora de padaria",
  "Exorcismo de Impressora: Fazendo ela funcionar sem ódio",
  "Terapia de Vidas Passadas para saber quem comeu seu iogurte",
  "Como fugir de parentes usando Realidade Aumentada",
  "Análise Técnica de Jogo do Bicho e Rinha de Galo Virtual"
];

const PIX_CODE = "34b749d6-b362-40d0-8247-b2b4ec8c6d3e";
const STORAGE_KEY = 'zoeira_academy_history_v1';

function App() {
  const [loading, setLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [history, setHistory] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [currentTopic, setCurrentTopic] = useState('O que vamos aprender hoje?');
  const [pixCopied, setPixCopied] = useState(false);
  
  // Quote Generator State
  const [impactQuote, setImpactQuote] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteCopied, setQuoteCopied] = useState(false);
  
  const spinInterval = useRef<number | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (newCourse: Course) => {
    // Avoid duplicates at the top
    const filteredHistory = history.filter(c => c.title !== newCourse.title);
    const updatedHistory = [newCourse, ...filteredHistory].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (confirm("Tem certeza? Isso vai apagar todo o seu histórico de fracassos.")) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleRandomGenerate = async () => {
    setLoading(true);
    setIsSpinning(true);
    setError('');
    setCourse(null);

    // 1. Start Visual Roulette (The Hook)
    // Fast cycling through topics
    spinInterval.current = window.setInterval(() => {
      const idx = Math.floor(Math.random() * ABSURD_TOPICS.length);
      setCurrentTopic(ABSURD_TOPICS[idx]);
    }, 80); // Fast speed

    // 2. Select the Actual Topic
    const finalIndex = Math.floor(Math.random() * ABSURD_TOPICS.length);
    const finalTopic = ABSURD_TOPICS[finalIndex];

    try {
      // 3. Call API in background
      // Minimal delay to ensure the user enjoys the spinning animation
      const [result] = await Promise.all([
        generateCourseContent(finalTopic),
        new Promise(resolve => setTimeout(resolve, 2000)) // Guarantee at least 2s of spin
      ]);

      // 4. Stop Roulette
      if (spinInterval.current) clearInterval(spinInterval.current);
      setCurrentTopic(finalTopic);
      setIsSpinning(false);
      
      // 5. Show Result
      setCourse(result);
      saveToHistory(result);

    } catch (err) {
      if (spinInterval.current) clearInterval(spinInterval.current);
      setIsSpinning(false);
      setError('A IA teve um ataque de riso e falhou. Tente de novo.');
      setCurrentTopic('Erro no Sistema Operacional do Universo');
    } finally {
      setLoading(false);
    }
  };

  const generateNewQuote = async () => {
    setQuoteLoading(true);
    const quote = await generateAbsurdQuote();
    setImpactQuote(quote);
    setQuoteLoading(false);
  };

  // --- FUNÇÕES DE COMPARTILHAMENTO ---
  const getShareText = () => {
    if (!impactQuote) return '';
    return `"${impactQuote}"\n\nSabedoria da Zoeira Academy 🎓\nGere o seu aqui: ${window.location.href}`;
  };

  const shareToWhatsApp = () => {
    if (!impactQuote) return;
    const text = getShareText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToTwitter = () => {
    if (!impactQuote) return;
    const text = `"${impactQuote}" - Sabedoria da Zoeira Academy 🎓`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    if (!impactQuote) return;
    const text = getShareText();
    navigator.clipboard.writeText(text);
    setQuoteCopied(true);
    setTimeout(() => setQuoteCopied(false), 2000);
  };

  const loadFromHistory = (historyCourse: Course) => {
    setCourse(historyCourse);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setCourse(null);
    setCurrentTopic('O que vamos aprender hoje?');
    setError('');
  };

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_CODE);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const scrollToDonation = () => {
    document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-pink-500 selection:text-white flex flex-col font-sans">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={reset}>
            <div className="bg-gradient-to-tr from-pink-500 to-violet-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-pink-500/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black tracking-tight text-white">
                Zoeira<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Academy</span>
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Educação Quântica</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={scrollToDonation}
                className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all group"
             >
                <Heart className="w-3 h-3 text-pink-500 group-hover:scale-125 transition-transform" />
                Apoie
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 flex-grow w-full flex flex-col items-center relative z-10">
        {!course ? (
          <div className="max-w-5xl w-full flex flex-col items-center space-y-16 animate-fade-in-up">
            
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-3xl mx-auto flex flex-col items-center">
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest shadow-xl">
                    <Sparkles className="w-3 h-3 mr-2 text-yellow-400" />
                    A Revolução da Educação Inútil
                  </div>
                  
                  {/* Botão Pix Solicitado */}
                  <button 
                    onClick={scrollToDonation}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest hover:bg-emerald-900/60 transition-colors cursor-pointer group"
                    title="Isso vai financiar outras ideias reais e importantes"
                  >
                     <Coffee className="w-3 h-3 mr-2" />
                     Doe se gostou
                     <span className="hidden sm:inline normal-case tracking-normal font-normal opacity-70 ml-2 border-l border-emerald-500/30 pl-2 text-[10px]">
                        Financie ideias reais
                     </span>
                  </button>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.1]">
                Gire a roleta do <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
                   conhecimento proibido
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                  Cansado de cursos reais que exigem esforço? 
                  <strong className="text-slate-200 font-semibold block mt-1">Deixe o algoritmo decidir sua próxima carreira fracassada.</strong>
              </p>
            </div>

            {/* The "Roulette" Interface */}
            <div className="w-full max-w-2xl relative group">
                {/* Glow behind the card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-violet-500 to-pink-500 rounded-[2rem] opacity-30 group-hover:opacity-50 blur-xl transition duration-500 animate-gradient-x"></div>
                
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    
                    {/* Screen Area */}
                    <div className="bg-black/50 rounded-[1.5rem] border border-white/5 p-8 md:p-12 min-h-[200px] flex flex-col items-center justify-center text-center mb-2 relative overflow-hidden">
                        {/* Scanlines effect via CSS class */}
                        <div className="scanlines"></div>
                        
                        {isSpinning ? (
                            <div className="relative z-10 flex flex-col items-center space-y-4">
                                <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                                <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400 animate-pulse">
                                    {currentTopic}
                                </h3>
                                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Sintonizando frequências absurdas...</p>
                            </div>
                        ) : (
                            <div className="relative z-10 space-y-4">
                                <Dices className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl md:text-2xl font-medium text-slate-300">
                                    "Não sei o que fazer da vida."
                                </h3>
                                <p className="text-sm text-slate-500">Clique abaixo e resolva isso agora.</p>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button 
                        onClick={handleRandomGenerate} 
                        disabled={loading} 
                        fullWidth
                        className="h-16 text-lg rounded-[1.2rem] shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 relative z-10"
                    >
                        {loading ? "GIRANDO A ROLETA..." : "SORTEAR MEU DESTINO"}
                        {!loading && <Dices className="ml-3 w-5 h-5 inline-block" />}
                    </Button>
                </div>
            </div>

            {error && (
              <div className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm max-w-md flex items-center gap-3">
                 <div className="p-2 bg-red-500/20 rounded-full"><Zap className="w-4 h-4"/></div>
                 {error}
              </div>
            )}

            {/* IMPACT QUOTE GENERATOR SECTION */}
            <div className="w-full max-w-3xl mt-12 pt-12 border-t border-white/5">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-white flex items-center justify-center gap-2 mb-2">
                        <Quote className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        Momento Sabedoria Desmotivacional
                    </h2>
                    <p className="text-slate-400 text-sm">Frases perfeitas para seu LinkedIn (ou terapia).</p>
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-2xl max-w-md mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="bg-slate-900 rounded-xl overflow-hidden relative aspect-[4/5] flex flex-col">
                        
                        {/* Fake Image Background */}
                        <div className="absolute inset-0">
                             <img 
                                src={`https://picsum.photos/seed/${impactQuote || 'default'}/600/800?grayscale&blur=2`}
                                className="w-full h-full object-cover opacity-40"
                                alt="Fundo motivacional"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
                            {quoteLoading ? (
                                <Loader2 className="w-12 h-12 text-white animate-spin" />
                            ) : (
                                <>
                                    <Quote className="w-10 h-10 text-pink-500 mb-6 opacity-80" />
                                    <p className="text-2xl md:text-3xl font-black text-white leading-tight font-serif italic drop-shadow-lg">
                                        "{impactQuote || "Clique no botão abaixo para receber um choque de realidade alternativa."}"
                                    </p>
                                    <div className="w-16 h-1 bg-yellow-500 mt-6 mb-2 rounded-full"></div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300 font-bold">
                                        Zoeira Academy
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="bg-white p-3 flex flex-col gap-3">
                         <Button 
                            onClick={generateNewQuote} 
                            disabled={quoteLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm py-3"
                         >
                            <Camera className="w-4 h-4 mr-2" />
                            {impactQuote ? "Gerar Outra Frase" : "Gerar Frase"}
                         </Button>

                         {/* Sharing Bar */}
                         <div className="flex gap-2">
                           <button 
                             onClick={shareToWhatsApp}
                             disabled={!impactQuote}
                             className="flex-1 flex items-center justify-center py-2 bg-[#25D366] hover:bg-[#20b858] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                             title="Compartilhar no WhatsApp"
                           >
                             <MessageCircle className="w-5 h-5" />
                           </button>
                           
                           <button 
                             onClick={shareToTwitter}
                             disabled={!impactQuote}
                             className="flex-1 flex items-center justify-center py-2 bg-black hover:bg-slate-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                             title="Compartilhar no X (Twitter)"
                           >
                             <Twitter className="w-5 h-5" />
                           </button>

                           <button 
                             onClick={copyToClipboard}
                             disabled={!impactQuote}
                             className="flex-1 flex items-center justify-center py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                             title="Copiar Link e Texto (Para Instagram)"
                           >
                             {quoteCopied ? <Check className="w-5 h-5 text-green-600" /> : <LinkIcon className="w-5 h-5" />}
                           </button>
                         </div>
                         <p className="text-[10px] text-center text-slate-400">
                           Para Instagram: Copie o link e cole no Story.
                         </p>
                    </div>
                </div>
            </div>

            {/* Dashboard / History Section */}
            {history.length > 0 && (
                <div className="w-full pt-12 border-t border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <History className="w-6 h-6 text-pink-500" />
                                Galeria da Vergonha
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Seus últimos diplomas imaginários.</p>
                        </div>
                        
                        <button 
                            onClick={clearHistory} 
                            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-lg hover:border-red-500/30 transition-all flex items-center gap-2 group"
                        >
                            <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform" /> 
                            Limpar rastros
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {history.map((hCourse, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => loadFromHistory(hCourse)}
                                className="bg-slate-900 border border-white/5 hover:border-pink-500/30 p-5 rounded-2xl cursor-pointer transition-all hover:bg-slate-800 hover:-translate-y-1 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight className="w-5 h-5 text-pink-500" />
                                </div>
                                
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/5 group-hover:border-pink-500/20 transition-colors">
                                        <GraduationCap className="w-5 h-5 text-slate-400 group-hover:text-pink-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-200 text-sm leading-snug line-clamp-2 group-hover:text-pink-300 transition-colors">
                                            {hCourse.title}
                                        </h3>
                                    </div>
                                </div>
                                
                                <p className="text-xs text-slate-500 italic mb-4 line-clamp-2 pl-14">
                                    "{hCourse.subtitle}"
                                </p>
                                
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono bg-black/20 p-2 rounded-lg ml-14">
                                    <span className="flex items-center gap-1.5">
                                        <Zap className="w-3 h-3 text-yellow-500" /> 
                                        {hCourse.rating}
                                    </span>
                                    <span className="truncate max-w-[100px]">{hCourse.instructorName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

          </div>
        ) : (
          <CourseCard course={course} onReset={reset} />
        )}
      </main>

      {/* Donation Section (Refined UI) */}
      <section id="donation-section" className="py-20 relative overflow-hidden mt-10">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-pink-900/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
           <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group">
              
              {/* Decorative elements */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 rounded-2xl shadow-2xl mb-2 rotate-3 transform group-hover:rotate-6 transition-transform">
                     <Coffee className="w-8 h-8 text-pink-500" />
                  </div>
                  
                  <div>
                      <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                        Financie o <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Caos Criativo</span>
                      </h2>
                  </div>

                  <p className="text-slate-400 text-base leading-relaxed">
                    A API do Google custa dinheiro (as vezes) e meu café custa caro. 
                    Se você riu, considere doar. Se não riu, doe pela pena.
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-md text-xs font-bold border border-green-500/20">
                          PIX Verificado
                      </span>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-md text-xs font-bold border border-purple-500/20">
                          Instantâneo
                      </span>
                  </div>
              </div>

              <div className="flex-shrink-0 w-full max-w-xs relative">
                  <div className="bg-white p-5 rounded-2xl shadow-2xl rotate-2 transform transition-transform group-hover:rotate-0 duration-500">
                     <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                        <span className="text-xs font-bold text-gray-400">QR CODE</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     </div>
                     
                     <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(PIX_CODE)}`}
                        alt="QR Code Pix"
                        className="w-full aspect-square mix-blend-multiply rounded-lg mb-4"
                      />
                      
                     <button 
                      onClick={copyPix}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
                        pixCopied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {pixCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {pixCopied ? "Copiado!" : "Copiar Chave"}
                    </button>
                  </div>
              </div>

           </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-slate-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <div className="text-center md:text-left">
              <p className="font-bold text-slate-300">Zoeira Academy © {new Date().getFullYear()}</p>
              <p className="text-xs mt-1">Feito com ódio e cafeína.</p>
          </div>
          <p className="text-xs opacity-50 max-w-sm text-center md:text-right">
            Isenção de responsabilidade: Este site é uma piada. Não tente aplicar "Mindset de Tubarão em Aquário" na vida real.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;