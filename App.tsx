import { useState } from 'react';
import { generateCourseContent } from './services/geminiService';
import { Course } from './types';
import { CourseCard } from './components/CourseCard';
import { Button } from './components/Button';
import { Sparkles, BrainCircuit, Dices, Loader2, Zap } from 'lucide-react';

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

function App() {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');

  const handleRandomGenerate = async () => {
    setLoading(true);
    setError('');
    setCourse(null);

    // Pick a random topic
    const randomIndex = Math.floor(Math.random() * ABSURD_TOPICS.length);
    const randomTopic = ABSURD_TOPICS[randomIndex];
    setCurrentTopic(randomTopic);

    try {
      const result = await generateCourseContent(randomTopic);
      setCourse(result);
    } catch (err) {
      setError('A IA teve um ataque de riso e não conseguiu gerar o curso. Tente de novo.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCourse(null);
    setCurrentTopic('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-pink-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={reset}>
            <div className="bg-gradient-to-tr from-pink-500 to-violet-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Zoeira<span className="text-pink-500">Academy</span>
            </span>
          </div>
          <div className="hidden md:flex items-center text-sm text-slate-400 gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Carreiras Frustradas</span>
            <span className="hover:text-white transition-colors cursor-pointer">Mentoria Reversa</span>
            <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-xs">
              Powered by Gemini
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        {!course ? (
          <div className="max-w-2xl mx-auto text-center space-y-10 animate-fade-in-up">
            
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                A Revolução da Educação Aleatória
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                Gire a roleta do <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  conhecimento inútil
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-lg mx-auto">
                Não sabe o que "aprender" hoje? Deixe o destino decidir sua próxima carreira fracassada.
              </p>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-violet-500/5 pointer-events-none"></div>
              
              <div className="mb-8">
                <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-slate-600 shadow-inner">
                  {loading ? (
                    <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                  ) : (
                    <Dices className="w-10 h-10 text-violet-400" />
                  )}
                </div>
                {loading && currentTopic ? (
                  <div className="animate-pulse space-y-2">
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Criando curso sobre:</p>
                    <p className="text-xl font-bold text-white leading-tight">"{currentTopic}"</p>
                  </div>
                ) : (
                  <p className="text-slate-300">
                    Clique abaixo para gerar um curso sobre um tema completamente bizarro e aleatório.
                  </p>
                )}
              </div>

              <Button 
                onClick={handleRandomGenerate} 
                disabled={loading} 
                fullWidth
                className="text-lg h-16"
              >
                {loading ? (
                  "Consultando os Astros..."
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Gerar Caos Aleatório
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center opacity-60">
                {['Certificados Falsos', 'Horas Complementares', 'Networking Imaginário', 'Dívidas Reais'].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors cursor-default">
                        {item}
                    </div>
                ))}
            </div>

          </div>
        ) : (
          <CourseCard course={course} onReset={reset} />
        )}
      </main>

      <footer className="border-t border-slate-800 mt-auto bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Zoeira Academy. Todos os direitos reservados à comédia.</p>
          <p className="mt-2 text-xs opacity-50">Este site é uma paródia. Não leve nada a sério. Não insira dados reais de cartão de crédito.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;