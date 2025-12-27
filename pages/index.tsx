import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { CourseRow } from "../components/CourseRow";
import { ResultCard } from "../components/ResultCard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface Course {
  name: string;
  credits: number;
  type: 'theory' | 'lab';
}

const courses: Course[] = [
  { name: "Mathematics – III (Probability & Statistics)", credits: 3, type: 'theory' },
  { name: "Logic and Switching Theory", credits: 3, type: 'theory' },
  { name: "Data Structures", credits: 3, type: 'theory' },
  { name: "Discrete Mathematics", credits: 3, type: 'theory' },
  { name: "OOP using JAVA", credits: 3, type: 'theory' },
  { name: "Introduction to Data Science", credits: 3, type: 'theory' },
  { name: "Effective Technical Communication in English", credits: 3, type: 'theory' },
  { name: "Data Structures Lab", credits: 1, type: 'lab' },
  { name: "Data Science Lab", credits: 1, type: 'lab' },
  { name: "OOP using JAVA Lab", credits: 1, type: 'lab' }
];

const gradePoints: { [key: string]: number } = {
  'S': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'E': 5,
  'F': 0
};

const markRanges = [
  { grade: 'S', range: '≥ 90', description: '90 and above' },
  { grade: 'A', range: '80-89', description: '80 to 89' },
  { grade: 'B', range: '70-79', description: '70 to 79' },
  { grade: 'C', range: '60-69', description: '60 to 69' },
  { grade: 'D', range: '50-60', description: '50 to 60' },
  { grade: 'E', range: '40-50', description: '40 to 50' },
  { grade: 'F', range: '< 40', description: 'Less than 40' }
];

export default function CGPACalculator() {
  const defaultGrades: { [key: string]: string } = {
    'Mathematics – III (Probability & Statistics)': 'D',
    'Logic and Switching Theory': 'C',
    'Data Structures': 'B',
    'Discrete Mathematics': 'B',
    'OOP using JAVA': 'B',
    'Introduction to Data Science': 'A',
    'Effective Technical Communication in English': 'B',
    'Data Structures Lab': 'B',
    'Data Science Lab': 'A',
    'OOP using JAVA Lab': 'B',
  };

  const [courseGrades, setCourseGrades] = useState<{ [key: string]: string }>(defaultGrades);
  const [sgpa, setSgpa] = useState<number>(0);
  const [prevSgpa, setPrevSgpa] = useState<string>('7.66');
  const [prevCredits, setPrevCredits] = useState<string>('40.5');
  const [cgpa, setCgpa] = useState<number>(0);
  const [editPrev, setEditPrev] = useState<boolean>(false);

  const currentCredits = 24;

  const handleGradeChange = (courseName: string, value: string) => {
    setCourseGrades(prev => ({
      ...prev,
      [courseName]: value
    }));
  };

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(course => {
      if (course.credits > 0) {
        const grade = courseGrades[course.name];
        if (grade) {
          const gradePoint = gradePoints[grade];
          totalCredits += course.credits;
          totalGradePoints += gradePoint * course.credits;
        }
      }
    });

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  const calculateCGPA = () => {
    const currentSgpa = sgpa;
    const previousSgpa = parseFloat(prevSgpa);
    const previousCredits = parseFloat(prevCredits);

    if (currentSgpa > 0 && !isNaN(previousSgpa) && !isNaN(previousCredits) && previousCredits > 0) {
      const totalCredits = previousCredits + currentCredits;
      const totalGradePoints = (previousSgpa * previousCredits) + (currentSgpa * currentCredits);
      return totalGradePoints / totalCredits;
    }
    return 0;
  };

  useEffect(() => {
    setSgpa(calculateSGPA());
  }, [courseGrades]);

  useEffect(() => {
    setCgpa(calculateCGPA());
  }, [sgpa, prevSgpa, prevCredits]);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-white text-black p-4 sm:p-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 sm:mb-12 border-b-4 border-black pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none">
                GPA<br/>Predictor
              </h1>
              <p className="font-mono text-sm mt-2 font-bold bg-black text-white inline-block px-2 py-1">
                SEM III • CSM
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-mono text-xs font-bold uppercase tracking-widest">Current Credits</p>
              <p className="font-mono text-3xl font-black">{currentCredits}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Course List */}
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
            <div className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <div className="bg-black text-white p-3 flex justify-between items-center">
                <h2 className="font-bold uppercase tracking-wider text-sm">Course List</h2>
                <span className="font-mono text-xs">{courses.length} Subjects</span>
              </div>
              <div className="divide-y divide-black">
                {courses.map(course => (
                  <CourseRow
                    key={course.name}
                    course={course}
                    grade={courseGrades[course.name]}
                    onGradeChange={(val) => handleGradeChange(course.name, val)}
                    markRanges={markRanges}
                  />
                ))}
              </div>
            </div>

            {/* Formulas & Reference (Desktop: Below courses) */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border-2 border-black p-4 bg-gray-50">
                <h3 className="font-bold uppercase text-xs mb-3 border-b border-black pb-1">Formulas</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="font-bold block mb-1">SGPA</span>
                    <span className="block text-gray-600">∑(GP × Credits) / ∑(Credits)</span>
                  </div>
                  <div>
                    <span className="font-bold block mb-1">CGPA</span>
                    <span className="block text-gray-600">(Prev CGPA × Prev Cr + Curr SGPA × Curr Cr) / Total Cr</span>
                  </div>
                </div>
              </div>

              <div className="border-2 border-black p-4 bg-gray-50">
                <h3 className="font-bold uppercase text-xs mb-3 border-b border-black pb-1">Grade Scale</h3>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                  {Object.entries(gradePoints).map(([grade, point]) => (
                    <div key={grade} className="bg-white border border-black p-1">
                      <span className="font-bold block">{grade}</span>
                      <span className="text-gray-500">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results (Sticky) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 order-1 lg:order-2">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <ResultCard 
                title="Expected SGPA" 
                value={sgpa} 
                subtitle={`Based on ${currentCredits} credits`} 
              />
              <ResultCard 
                title="Expected CGPA" 
                value={cgpa} 
                subtitle={`Total: ${(parseFloat(prevCredits) + currentCredits).toFixed(1)} Cr`}
                onEdit={() => setEditPrev(!editPrev)}
                isEditing={editPrev}
              />
            </div>

            {editPrev && (
              <div className="border-2 border-black p-4 bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-top-2 duration-200">
                <h3 className="font-bold uppercase text-xs mb-4 text-center tracking-widest">Edit Previous Semesters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono mb-1 text-gray-400">Prev CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 font-mono focus:outline-none focus:border-white transition-colors"
                      value={prevSgpa}
                      onChange={(e) => setPrevSgpa(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono mb-1 text-gray-400">Prev Credits</label>
                    <input
                      type="number"
                      step="0.5"
                      className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 font-mono focus:outline-none focus:border-white transition-colors"
                      value={prevCredits}
                      onChange={(e) => setPrevCredits(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
