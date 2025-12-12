export interface Lesson {
  title: string;
  duration: string; // e.g., "15 segundos" or "3 horas de silêncio"
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  title: string;
  subtitle: string;
  instructorName: string;
  instructorBio: string;
  description: string;
  price: string;
  rating: number; // 0 to 5
  studentCount: number;
  tags: string[];
  modules: Module[];
  testimonial: {
    name: string;
    text: string;
  };
}
