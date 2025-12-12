import React, { useState } from 'react';
import { Course } from '../types';
import { Button } from './Button';
import { LessonModal } from './LessonModal';
import { CheckCircle, Play, Star, Users, Award, Lock, AlertTriangle, Eye } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onReset: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onReset }) => {
  const [purchased, setPurchased] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{title: string, moduleTitle: string} | null>(null);

  const handlePurchase = () => {
    alert(`Parabéns! Você acaba de gastar ${course.price} em absolutamente nada. O banco agradece.`);
    setPurchased(true);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
        {/* Header / Hero */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
          <div className="h-48 md:h-64 bg-slate-700 relative overflow-hidden group">
            <img 
              src={`https://picsum.photos/800/400?grayscale&blur=2`} 
              alt="Course Header" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent flex flex-col justify-end p-6 md:p-8">
              <div className="flex gap-2 mb-3 flex-wrap">
                  {course.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider rounded border border-violet-500/30">
                          {tag}
                      </span>
                  ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-slate-300 font-light italic">
                "{course.subtitle}"
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-slate-900/50 p-4 flex flex-wrap gap-6 border-b border-slate-700 text-sm md:text-base">
            <div className="flex items-center text-yellow-400">
              <Star className="w-5 h-5 mr-1 fill-yellow-400" />
              <span className="font-bold">{course.rating}</span>
              <span className="text-slate-500 ml-1">({Math.floor(Math.random() * 5000)} reviews fakes)</span>
            </div>
            <div className="flex items-center text-slate-300">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              <span>{course.studentCount.toLocaleString()} vítimas inscritas</span>
            </div>
             <div className="flex items-center text-slate-300">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
              <span>Certificado de Incompetência Incluso</span>
            </div>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                  
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-pink-500" />
                          O que você vai (fingir que vai) aprender
                      </h3>
                      <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-700 text-slate-300 leading-relaxed">
                          {course.description}
                      </div>
                  </section>

                  <section>
                      <h3 className="text-xl font-bold text-white mb-4">Conteúdo do Curso</h3>
                      <div className="space-y-4">
                          {course.modules.map((mod, idx) => (
                              <div key={idx} className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600">
                                  <div className="p-4 bg-slate-700 flex justify-between items-center">
                                      <h4 className="font-bold text-slate-200">Módulo {idx + 1}: {mod.title}</h4>
                                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{mod.lessons.length} aulas</span>
                                  </div>
                                  <div className="p-4 text-sm text-slate-400 border-b border-slate-600 italic">
                                      {mod.description}
                                  </div>
                                  <ul className="divide-y divide-slate-600/50">
                                      {mod.lessons.map((lesson, lIdx) => (
                                          <li 
                                            key={lIdx} 
                                            className="p-3 flex justify-between items-center hover:bg-slate-600/30 transition-colors cursor-pointer group"
                                            onClick={() => setSelectedLesson({ title: lesson.title, moduleTitle: mod.title })}
                                          >
                                              <div className="flex items-center">
                                                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-pink-500 group-hover:text-white transition-colors text-slate-500">
                                                    <Play className="w-3 h-3 ml-0.5" />
                                                  </div>
                                                  <div>
                                                    <span className="text-slate-300 block group-hover:text-white font-medium transition-colors">{lesson.title}</span>
                                                    <span className="text-xs text-pink-500/0 group-hover:text-pink-500 transition-colors flex items-center">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Assistir Aula (Gerar com IA)
                                                    </span>
                                                  </div>
                                              </div>
                                              <span className="text-xs text-slate-500 font-mono">{lesson.duration}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          ))}
                      </div>
                  </section>

                  <section className="bg-slate-700/20 p-6 rounded-2xl border border-dashed border-slate-600 text-center">
                      <p className="text-2xl mb-4">❝</p>
                      <p className="text-lg text-slate-300 italic mb-4">
                          {course.testimonial.text}
                      </p>
                      <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full"></div>
                          <div className="text-left">
                              <p className="text-sm font-bold text-white">{course.testimonial.name}</p>
                              <p className="text-xs text-slate-500">Ex-Fracassado(a)</p>
                          </div>
                      </div>
                  </section>
              </div>

              {/* Sidebar */}
              <div className="md:col-span-1 space-y-6">
                  <div className="sticky top-6">
                      <div className="bg-white rounded-xl p-6 shadow-xl text-slate-900 space-y-6">
                          <div className="h-40 w-full bg-slate-200 rounded-lg mb-4 relative overflow-hidden">
                              <img 
                                  src={`https://picsum.photos/seed/${course.instructorName}/400/400`} 
                                  className="w-full h-full object-cover" 
                                  alt="Instructor"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group hover:bg-black/10 transition-colors cursor-pointer">
                                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-lg">
                                      <Play className="w-6 h-6 text-slate-900" />
                                  </div>
                              </div>
                          </div>
                          
                          <div>
                              <p className="text-3xl font-black text-slate-900 mb-1">{course.price}</p>
                              <p className="text-sm text-red-500 line-through font-semibold">R$ 1.000.000,00</p>
                              <p className="text-xs text-slate-500 mt-1">99% de desconto (hoje não)</p>
                          </div>

                          <Button 
                              fullWidth 
                              onClick={handlePurchase} 
                              disabled={purchased}
                          >
                              {purchased ? "Vendido (Infelizmente)" : "Comprar Agora"}
                          </Button>
                          <p className="text-xs text-center text-slate-400">Garantia de arrependimento de 30 dias.</p>

                          <div className="pt-6 border-t border-slate-200">
                              <h4 className="font-bold text-sm mb-2">Seu Mentor:</h4>
                              <p className="text-lg font-bold text-slate-800">{course.instructorName}</p>
                              <p className="text-sm text-slate-600 mt-2 leading-snug">{course.instructorBio}</p>
                          </div>

                          <div className="space-y-2 text-sm text-slate-600">
                              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600"/> Acesso vitalício (até o servidor cair)</div>
                              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-600"/> Suporte inexistente</div>
                              <div className="flex items-center"><Lock className="w-4 h-4 mr-2 text-green-600"/> Pagamento inseguro</div>
                          </div>
                      </div>
                      
                      <div className="mt-4">
                          <Button variant="secondary" fullWidth onClick={onReset}>
                              Criar Outro Curso Bizarro
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      <LessonModal
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
        lessonTitle={selectedLesson?.title || ''}
        moduleTitle={selectedLesson?.moduleTitle || ''}
        courseTitle={course.title}
      />
    </>
  );
};
