import { useState, useEffect } from 'react';
import { generateCourseContent } from './services/geminiService';
import { Course } from './types';
import { CourseCard } from './components/CourseCard';
import { Button } from './components/Button';
import { Sparkles, BrainCircuit, Dices, Loader2, Zap, Coffee, Copy, Check, Heart, History, RotateCcw, Trash2 } from 'lucide-react';

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

const PIX_CODE = "00020126860014BR.GOV.BCB.PIX013634b749d6-b362-40d0-8247-b2b4ec8c6d3e0224me ajude a pagar um café5204000053039865802BR5923Matheus Henrique Castro6009SAO PAULO62140510XHGFH3iwc363046E0E";
const STORAGE_KEY = 'zoeira_academy_history_v1';

function App() {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [history, setHistory] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

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
    const updatedHistory = [newCourse, ...history].slice(0, 10);
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
    setError('');
    setCourse(null);

    const randomIndex = Math.floor(Math.random() * ABSURD_TOPICS.length);
    const randomTopic = ABSURD_TOPICS[randomIndex];
    setCurrentTopic(randomTopic);

    try {
      const result = await generateCourseContent(randomTopic);
      setCourse(result);
      saveToHistory(result);
    } catch (err) {
      setError('A IA teve um ataque de riso e falhou. Tente de novo.');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (historyCourse: Course) => {
    setCourse(historyCourse);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setCourse(null);
    setCurrentTopic('');
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
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-pink-500 selection:text-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer active:scale-95 transition-transform" onClick={reset}>
            <div className="bg-gradient-to-tr from-pink-500 to-violet-600 p-1.5 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-extrabold tracking-tight">
              Zoeira<span className="text-pink-500">Academy</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={scrollToDonation}
                className="hidden md:flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20 hover:border-pink-500/50 transition-all shadow-[0_0_10px_rgba(236,72,153,0.3)] animate-pulse"
             >
                <Heart className="w-3 h-3 fill-pink-500" />
                Apoie o Projeto
             </button>
            <span className="bg-slate-800 px-2 py-1 rounded-full border border-slate-700 text-[10px] md:text-xs text-slate-400">
              v1.0 Beta
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-16 flex-grow w-full flex flex-col items-center">
        {!course ? (
          <div className="max-w-4xl w-full flex flex-col items-center space-y-12 animate-fade-in-up">
            
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2 shadow-inner">
                <Sparkles className="w-3 h-3 mr-2 text-pink-500" />
                A Revolução da Educação Aleatória
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white leading-tight">
                Gire a roleta do <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
                   conhecimento inútil
                </span>
              </h1>
              
              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl max-w-lg mx-auto backdrop-blur-sm transform rotate-1 hover:rotate-0 transition-transform duration-300">
                 <p className="text-base md:text-lg text-slate-300 font-medium">
                  "Não sabe o que 'aprender' hoje? <br/>
                  <span className="text-pink-400 font-bold">Deixe o destino decidir</span> sua próxima carreira fracassada."
                 </p>
              </div>
            </div>

            {/* Generator Card */}
            <div className="bg-slate-800/80 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group max-w-lg w-full">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent opacity-50 pointer-events-none"></div>
              
              <div className="mb-6 md:mb-8 min-h-[120px] flex flex-col justify-center text-center">
                {!loading && (
                    <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-slate-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Dices className="w-10 h-10 text-violet-400" />
                    </div>
                )}
                
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto" />
                    <div>
                        <p className="text-xs text-pink-400 uppercase tracking-widest font-bold mb-1">Processando insanidade...</p>
                        <p className="text-xl font-bold text-white leading-tight px-4">"{currentTopic}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg">Pronto para o caos?</h3>
                    <p className="text-slate-400 text-sm">
                      Clique abaixo e gere um curso completo instantaneamente.
                    </p>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleRandomGenerate} 
                disabled={loading} 
                fullWidth
                className="text-lg h-16 shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_-5px_rgba(236,72,153,0.5)] transition-all duration-300 border-t border-white/20"
              >
                {loading ? "Inventando mentiras..." : "GERAR CURSO BIZARRO"}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm max-w-md">
                {error}
              </div>
            )}

            {/* History Section */}
            {history.length > 0 && (
                <div className="w-full pt-10 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-300">
                            <History className="w-5 h-5 text-pink-500" />
                            Histórico de Fracassos
                        </h2>
                        <button onClick={clearHistory} className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                            <Trash2 className="w-3 h-3" /> Limpar
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {history.map((hCourse, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => loadFromHistory(hCourse)}
                                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-pink-500/50 p-4 rounded-xl cursor-pointer transition-all hover:-translate-y-1 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <RotateCcw className="w-4 h-4 text-pink-500" />
                                </div>
                                <h3 className="font-bold text-slate-200 text-sm mb-1 line-clamp-1 group-hover:text-pink-400 transition-colors">{hCourse.title}</h3>
                                <p className="text-xs text-slate-500 italic mb-3 line-clamp-1">"{hCourse.subtitle}"</p>
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> {hCourse.rating}</span>
                                    <span>{hCourse.instructorName}</span>
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

      {/* Donation Section Highlighted */}
      <section id="donation-section" className="py-16 md:py-24 relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-slate-900 to-slate-900 opacity-50"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
           {/* Card Container with enhanced visuals */}
           <div className="bg-slate-900/60 backdrop-blur-xl border-2 border-pink-500 rounded-[2rem] p-8 md:p-12 shadow-[0_0_60px_-15px_rgba(236,72,153,0.4)] flex flex-col md:flex-row items-center gap-10 md:gap-16 transform transition-transform hover:scale-[1.005]">
              
              {/* Text Side */}
              <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="inline-block relative">
                     <div className="absolute -inset-1 bg-pink-500 blur opacity-30 rounded-full animate-pulse"></div>
                     <div className="relative inline-flex items-center justify-center p-4 bg-gradient-to-br from-pink-500 to-violet-600 text-white rounded-2xl shadow-xl rotate-3 transform mb-2">
                        <Coffee className="w-10 h-10" />
                     </div>
                  </div>
                  
                  <div>
                      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2">
                        Momento <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">Pidão</span> 🐮
                      </h2>
                      <p className="text-pink-300 font-bold text-lg">
                          Gostou da zoeira? Pague meu café!
                      </p>
                  </div>

                  <p className="text-slate-300 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                    Esse site roda a base de <b>criatividade questionável e boletos atrasados</b>. 
                    Se você riu (ou chorou de vergonha alheia), considere apoiar este nobre projeto inútil.
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm text-slate-400 flex items-center">
                          <Check className="w-4 h-4 mr-2 text-green-500" /> 100% doado para café
                      </div>
                       <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm text-slate-400 flex items-center">
                          <Check className="w-4 h-4 mr-2 text-green-500" /> Ajuda a manter a API viva
                      </div>
                  </div>
              </div>

              {/* QR Code Side */}
              <div className="flex-shrink-0 w-full max-w-sm relative group">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-[1.5rem] blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-white p-6 rounded-2xl shadow-2xl rotate-1 transform border-4 border-slate-800">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                        CHAVE PIX
                     </div>
                     
                     <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(PIX_CODE)}`}
                        alt="QR Code Pix"
                        className="w-full aspect-square mix-blend-multiply mb-6 mx-auto rounded-lg"
                      />
                      
                      <div className="space-y-4">
                         <div className="bg-slate-100 rounded-xl p-3 text-[11px] text-slate-600 font-mono text-center break-all flex items-center justify-center min-h-[3rem] border border-slate-200">
                            {PIX_CODE}
                         </div>
                         <button 
                          onClick={copyPix}
                          className={`w-full py-4 px-6 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${
                            pixCopied 
                            ? 'bg-green-500 text-white shadow-green-500/30 ring-2 ring-green-300' 
                            : 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-slate-900/30 border border-slate-700'
                          }`}
                        >
                          {pixCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          {pixCopied ? "Chave Copiada!" : "Copiar Código Pix"}
                        </button>
                      </div>
                  </div>
              </div>

           </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="mb-3 font-medium text-slate-400">© {new Date().getFullYear()} Zoeira Academy.</p>
          <p className="text-xs opacity-50 max-w-lg mx-auto leading-relaxed">
            Atenção: Nenhum conteúdo gerado aqui deve ser levado a sério. 
            Não use estas dicas para operar máquinas pesadas, fazer cirurgias ou tomar decisões financeiras.
            Se você comprar um curso inexistente, a culpa é sua.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;