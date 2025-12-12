import { useState } from 'react';
import { generateCourseContent } from './services/geminiService';
import { Course } from './types';
import { CourseCard } from './components/CourseCard';
import { Button } from './components/Button';
import { Sparkles, BrainCircuit, Dices, Loader2, Zap, Coffee, Copy, Check, Heart } from 'lucide-react';

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

function App() {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

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
    } catch (err) {
      setError('A IA teve um ataque de riso e falhou. Tente de novo.');
    } finally {
      setLoading(false);
    }
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
                className="hidden md:flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20 hover:border-pink-500/50 transition-all"
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
          <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in-up">
            
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-2">
                <Sparkles className="w-3 h-3 mr-2" />
                IA Geradora de Lero-Lero
              </div>
              <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white leading-tight">
                Aprenda o <br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  impossível
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 max-w-lg mx-auto px-2">
                Gere um curso completo sobre absolutamente qualquer coisa inútil em segundos.
              </p>
            </div>

            <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group max-w-lg mx-auto w-full">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-violet-500/5 pointer-events-none"></div>
              
              <div className="mb-6 md:mb-8 min-h-[100px] flex flex-col justify-center">
                {!loading && (
                    <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-slate-600 shadow-inner">
                        <Dices className="w-8 h-8 text-violet-400" />
                    </div>
                )}
                
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Gerando insanidade...</p>
                    <p className="text-lg font-bold text-white leading-tight px-4">"{currentTopic}"</p>
                  </div>
                ) : (
                  <p className="text-slate-300 text-sm md:text-base">
                    Clique para gerar um curso aleatório.
                  </p>
                )}
              </div>

              <Button 
                onClick={handleRandomGenerate} 
                disabled={loading} 
                fullWidth
                className="text-lg h-14 md:h-16 active:scale-95"
              >
                {loading ? "Inventando mentiras..." : "Gerar Curso Aleatório"}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}
          </div>
        ) : (
          <CourseCard course={course} onReset={reset} />
        )}
      </main>

      {/* Donation Section Highlighted */}
      <section id="donation-section" className="py-12 md:py-20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
           <div className="bg-slate-900/80 backdrop-blur-lg border-2 border-pink-500/50 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] flex flex-col md:flex-row items-center gap-8 md:gap-12 transform transition-transform hover:scale-[1.01]">
              
              <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center justify-center p-3 bg-pink-500 text-white rounded-2xl shadow-lg shadow-pink-500/20 mb-2 rotate-3 transform">
                     <Coffee className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                    Momento <span className="text-pink-500">Pidão</span> 🐮
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Esse site roda a base de <b>café e boletos atrasados</b>. Se eu tirei um sorriso do seu rosto (ou te fiz questionar minha sanidade), fortalece aí com um cafezinho!
                  </p>
                  <p className="text-sm text-pink-400 font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                    <Heart className="w-4 h-4 animate-pulse" />
                    Ajude um Dev Cansado
                  </p>
              </div>

              <div className="flex-shrink-0 bg-white p-4 rounded-2xl shadow-2xl rotate-1 transform border-4 border-slate-800 w-full max-w-xs md:w-auto">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(PIX_CODE)}`}
                    alt="QR Code Pix"
                    className="w-full aspect-square md:w-48 md:h-48 mix-blend-multiply mb-4 mx-auto"
                  />
                  
                  <div className="space-y-3">
                     <div className="bg-slate-100 rounded-lg p-2 text-[10px] text-slate-500 font-mono text-center break-all h-12 overflow-hidden relative">
                        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-100 to-transparent"></div>
                        {PIX_CODE}
                     </div>
                     <button 
                      onClick={copyPix}
                      className={`w-full py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
                        pixCopied 
                        ? 'bg-green-500 text-white shadow-green-500/30' 
                        : 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-500/30'
                      }`}
                    >
                      {pixCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {pixCopied ? "Copiado!" : "Copiar Chave Pix"}
                    </button>
                  </div>
              </div>

           </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} Zoeira Academy. Feito com ❤️ e ☕.</p>
          <p className="text-xs opacity-50 max-w-md mx-auto">
            Atenção: Nenhum conteúdo gerado aqui deve ser levado a sério. Não use estas dicas para operar máquinas pesadas ou tomar decisões de vida.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;