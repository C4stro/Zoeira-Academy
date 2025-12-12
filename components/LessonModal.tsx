import React, { useEffect, useState } from 'react';
import { generateLessonContent } from '../services/geminiService';
import { X, PlayCircle, Loader2, BookOpen } from 'lucide-react';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  moduleTitle: string;
  courseTitle: string;
}

export const LessonModal: React.FC<LessonModalProps> = ({ 
  isOpen, 
  onClose, 
  lessonTitle, 
  moduleTitle, 
  courseTitle 
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && lessonTitle) {
      const fetchContent = async () => {
        setLoading(true);
        const text = await generateLessonContent(courseTitle, moduleTitle, lessonTitle);
        setContent(text);
        setLoading(false);
      };
      fetchContent();
    } else {
      setContent('');
    }
  }, [isOpen, lessonTitle, moduleTitle, courseTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
          <h3 className="font-bold text-white truncate pr-4">{lessonTitle}</h3>
          <button 
            onClick={onClose}
            className={`p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white ${loading ? 'animate-bounce' : ''}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Placeholder */}
        <div className="aspect-video bg-black relative flex items-center justify-center border-b border-slate-800 group cursor-not-allowed">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/50 to-transparent"></div>
            <img 
                src={`https://picsum.photos/seed/${lessonTitle}/800/450?grayscale&blur=5`} 
                className="w-full h-full object-cover opacity-30" 
                alt="Video placeholder"
            />
            <div className="absolute z-10 flex flex-col items-center">
                <PlayCircle className="w-16 h-16 text-white/50 mb-4" />
                <p className="text-slate-500 text-sm font-mono bg-black/50 px-3 py-1 rounded">
                    Player de Vídeo 4K (Mentira)
                </p>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900 custom-scrollbar">
            <div className="flex items-center mb-6 text-pink-500 text-sm font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4 mr-2" />
                Material de Apoio (Ouro Puro)
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-slate-500">
                    <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
                    <p className="animate-pulse">Canalizando a sabedoria inútil da IA...</p>
                </div>
            ) : (
                <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-300 prose-headings:text-white prose-strong:text-pink-400">
                    {content.split('\n').map((line, i) => (
                        <p key={i} className="mb-4 leading-relaxed whitespace-pre-line">
                            {line}
                        </p>
                    ))}
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 text-center text-xs text-slate-500">
            Você completou 0% desta aula (e continuará assim).
        </div>
      </div>
    </div>
  );
};