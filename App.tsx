import { useState } from 'react';
import { generateCourseContent } from './services/geminiService';
import { Course } from './types';
import { CourseCard } from './components/CourseCard';
import { Button } from './components/Button';
import { Sparkles, BrainCircuit, Dices, Loader2, Zap, Coffee, Copy, Check } from 'lucide-react';

const ABSURD_TOPICS = [
  "Como convencer seu gato a pagar metade do aluguel",
  "Mestrado em Fofoca de Bairro e Investigação Digital",
  "Técnicas avançadas para dobrar lençol de elástico com a força da mente",
  "Como ficar milionário vendendo ar engarrafado gourmet",
  "Doutorado em responder 'Vou ver e te aviso' sem culpa",
  "Sobrevivência em Grupo de Família do WhatsApp: Módulo Avançado",
  "Como pilotar nave alienígena sem carteira de motorista",
  "Coach Quântico de Vegetais: Como motivar sua salada",
  "Estratégias para parecer ocupado no trabalho enquanto dorme de olhos abertos",
  "Como criar um esquema de pirâmide baseado em abraços virtuais",
  "Culinária Molecular para fazer Miojo Gourmet de R$ 300,00",
  "Como treinar sua avó para ser uma pro-player de CS:GO",
  "Feng Shui para organizar a área de trabalho do Windows",
  "Interpretação de sonhos de eletrodomésticos",
  "Como ganhar discussões imaginárias no chuveiro (Nível Hard)"
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
          <div className="flex items-center gap-2">
            <span className="bg-slate-800 px-2 py-1 rounded-full border border-slate-700 text-[10px] md:text-xs text-slate-400">
              v1.0 (Beta Caótico)
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

      {/* Donation Section */}
      <section className="border-t border-slate-800 bg-slate-900/50 py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
           <div className="inline-flex items-center justify-center p-3 bg-pink-500/10 rounded-full ring-1 ring-pink-500/30">
              <Coffee className="w-6 h-6 text-pink-500" />
           </div>
           
           <div className="space-y-2">
             <h2 className="text-xl md:text-3xl font-bold text-white">Me paga um café? 🥺</h2>
             <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto">
               Sou pobre e esse site não paga meus boletos. Se você riu, considere doar qualquer centavo.
             </p>
           </div>

           <div className="bg-slate-800 p-4 md:p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col md:flex-row gap-6 items-center w-full">
              <div className="bg-white p-2 rounded-xl shadow-inner flex-shrink-0">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(PIX_CODE)}`}
                  alt="QR Code Pix"
                  className="w-32 h-32 md:w-40 md:h-40 mix-blend-multiply"
                />
              </div>

              <div className="flex flex-col gap-3 text-left w-full overflow-hidden">
                 <div className="w-full">
                    <span className="text-[10px] md:text-xs uppercase tracking-wider text-slate-500 font-bold">Chave Pix (Copia e Cola)</span>
                    <div className="relative mt-1">
                      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-[10px] md:text-xs text-slate-400 font-mono break-all whitespace-normal h-auto max-h-24 overflow-y-auto custom-scrollbar select-all">
                          {PIX_CODE}
                      </div>
                    </div>
                 </div>
                 
                 <button 
                   onClick={copyPix}
                   className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
                     pixCopied 
                     ? 'bg-green-500 text-white shadow-green-500/25 shadow-lg' 
                     : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25 shadow-lg'
                   }`}
                 >
                   {pixCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   {pixCopied ? "Copiado!" : "Copiar Código Pix"}
                 </button>
              </div>
           </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} Zoeira Academy.</p>
          <p className="mt-1 opacity-50">Não leve a sério.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;