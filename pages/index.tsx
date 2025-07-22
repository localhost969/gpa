import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";

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
  { name: "Environmental Sciences", credits: 0, type: 'theory' },
  { name: "Essence of Indian Traditional Knowledge", credits: 0, type: 'theory' },
  { name: "English", credits: 2, type: 'theory' },
  { name: "Chemistry", credits: 4, type: 'theory' },
  { name: "Differential Equations & Numerical Methods", credits: 4, type: 'theory' },
  { name: "Scientific Programming", credits: 3, type: 'theory' },
  { name: "English Lab", credits: 1, type: 'lab' },
  { name: "Chemistry Lab", credits: 1.5, type: 'lab' },
  { name: "Workshop Practice", credits: 3, type: 'lab' },
  { name: "Scientific Programming Lab", credits: 1, type: 'lab' }
];

const gradePoints: { [key: string]: number } = {
  'S': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'F': 0
};

const markRanges = [
  { grade: 'S', range: '≥ 90', description: '90 and above' },
  { grade: 'A', range: '80-89', description: '80 to 89' },
  { grade: 'B', range: '70-79', description: '70 to 79' },
  { grade: 'C', range: '60-69', description: '60 to 69' },
  { grade: 'D', range: '40-59', description: '40 to 59' },
  { grade: 'F', range: '< 40', description: 'Less than 40' }
];

export default function CGPACalculator() {
  const defaultGrades: { [key: string]: string } = {
    'English': 'B',
    'Chemistry': 'A',
    'Scientific Programming': 'A',
    'Differential Equations & Numerical Methods': 'C',
    'English Lab': 'A',
    'Chemistry Lab': 'A',
    'Workshop Practice': 'A',
    'Scientific Programming Lab': 'A',
  };

  const [courseGrades, setCourseGrades] = useState<{ [key: string]: string }>(defaultGrades);
  const [sgpa, setSgpa] = useState<number>(0);
  const [prevSgpa, setPrevSgpa] = useState<string>('7.64');
  const [prevCredits, setPrevCredits] = useState<string>('21');
  const [cgpa, setCgpa] = useState<number>(0);
  const [editPrev, setEditPrev] = useState<boolean>(false);

  const currentCredits = 19.5;

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

  const theoryCourses = courses.filter(course => course.type === 'theory' && course.credits > 0);
  const labCourses = courses.filter(course => course.type === 'lab');

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-white text-black p-6`}>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 border-b border-gray-300 pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight sm:leading-tight break-words sm:break-normal px-2 sm:px-0">
            II-SEM SGPA & CGPA Calculator
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 font-mono text-sm sm:text-base">for CSM Students</p>
        </header>

        <div className="block md:hidden">
          <div className="flex flex-row gap-2 mb-6">
            <div className="flex-1 bg-black text-white rounded-lg p-2 text-center min-w-0">
              <h2 className="text-base font-bold mb-1">Expected SGPA</h2>
              <div className="text-xl font-mono font-bold">
                {sgpa.toFixed(2)}
              </div>
              <p className="text-gray-300 mt-1 font-mono text-xs">
                Current Credits: 19.5
              </p>
            </div>
            <div className="flex-1 bg-black text-white rounded-lg p-2 text-center relative min-w-0">
              <h2 className="text-base font-bold mb-1 flex items-center justify-center gap-2">
                Expected CGPA
                <button
                  className="ml-2 text-gray-300 hover:text-white text-xs underline focus:outline-none"
                  title="Edit Previous SGPA"
                  onClick={() => setEditPrev((v) => !v)}
                >
                  {editPrev ? 'Close' : 'Edit'}
                </button>
              </h2>
              <div className="text-xl font-mono font-bold">
                {cgpa.toFixed(2)}
              </div>
              <p className="text-gray-300 mt-1 font-mono text-xs">
                Total Credits: {(parseFloat(prevCredits) + currentCredits).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {editPrev && (
          <div className="max-w-md mx-auto mb-8 bg-white border border-gray-300 rounded-lg p-6 flex flex-col md:flex-row items-center justify-center gap-6 shadow">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label className="text-sm font-medium text-gray-700">Prev SGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="w-24 px-2 py-1 border border-gray-300 rounded font-mono text-center"
                value={prevSgpa}
                onChange={(e) => setPrevSgpa(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label className="text-sm font-medium text-gray-700">Prev Credits</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="w-24 px-2 py-1 border border-gray-300 rounded font-mono text-center"
                value={prevCredits}
                onChange={(e) => setPrevCredits(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Theory Courses</h2>
            <p className="text-sm text-gray-600 mb-4 font-mono text-center">
              Select expected marks range
            </p>
            <div className="space-y-4">
              {theoryCourses.map(course => (
                <div key={course.name} className="bg-white border border-gray-200 rounded p-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{course.name}</span>
                      <span className="text-gray-500 font-mono text-xs">({course.credits} credits)</span>
                    </div>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                      value={courseGrades[course.name] || ''}
                      onChange={(e) => handleGradeChange(course.name, e.target.value)}
                    >
                      <option value="">Select Mark Range</option>
                      {markRanges.map(range => (
                        <option key={range.grade} value={range.grade}>
                          {range.grade} - ({range.description} marks)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Practical/Laboratory Courses</h2>
            <p className="text-sm text-gray-600 mb-4 font-mono text-center">
              Select expected grade
            </p>
            <div className="space-y-4">
              {labCourses.map(course => (
                <div key={course.name} className="bg-white border border-gray-200 rounded p-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{course.name}</span>
                      <span className="text-gray-500 font-mono text-xs">({course.credits} credits)</span>
                    </div>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                      value={courseGrades[course.name] || ''}
                      onChange={(e) => handleGradeChange(course.name, e.target.value)}
                    >
                      <option value="">Select Grade</option>
                      <option value="S">S (10 points)</option>
                      <option value="A">A (9 points)</option>
                      <option value="B">B (8 points)</option>
                      <option value="C">C (7 points)</option>
                      <option value="D">D (6 points)</option>
                      <option value="F">F (0 points)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black text-white rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Expected SGPA</h2>
            <div className="text-3xl font-mono font-bold">
              {sgpa.toFixed(2)}
            </div>
            <p className="text-gray-300 mt-2 font-mono text-sm">
              Current Credits: 19.5
            </p>
          </div>
          <div className="bg-black text-white rounded-lg p-6 text-center relative">
            <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              Expected CGPA
              <button
                className="ml-2 text-gray-300 hover:text-white text-xs underline focus:outline-none"
                title="Edit Previous SGPA"
                onClick={() => setEditPrev((v) => !v)}
              >
                {editPrev ? 'Close' : 'Edit'}
              </button>
            </h2>
            <div className="text-3xl font-mono font-bold">
              {cgpa.toFixed(2)}
            </div>
            <p className="text-gray-300 mt-2 font-mono text-sm">
              Total Credits: {(parseFloat(prevCredits) + currentCredits).toFixed(1)}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 mb-8 shadow-sm max-w-6xl mx-auto">
          <h3 className="font-semibold mb-4 text-center text-base sm:text-lg tracking-tight">Calculation Formulas</h3>
          <div className="flex flex-col sm:flex-row gap-4 text-sm font-mono text-center items-center justify-center">
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-black text-white rounded-full px-2 py-0.5 text-xs font-bold">SGPA</span>
              </div>
              <div className="text-gray-800 font-semibold text-base">∑(Grade Point × Credits) / ∑(Credits)</div>
            </div>
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-black text-white rounded-full px-2 py-0.5 text-xs font-bold">CGPA</span>
              </div>
              <div className="text-gray-800 font-semibold text-base">(Prev SGPA × Prev Credits + Current SGPA × Current Credits) / Total Credits</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-gray-100 border border-gray-200 rounded-2xl px-2 py-3 shadow-sm w-full max-w-6xl">
            <h3 className="font-semibold mb-3 text-base sm:text-lg tracking-tight">Grade Scale Reference</h3>
            <div className="flex flex-row items-stretch justify-center overflow-x-auto divide-x divide-gray-300 text-sm font-mono">
              <div className="flex flex-col items-center px-3 min-w-[80px]">
                <span className="font-bold text-base">S = 10</span>
                <span className="text-xs text-gray-600">≥ 90</span>
              </div>
              <div className="flex flex-col items-center px-3 min-w-[80px]">
                <span className="font-bold text-base">A = 9</span>
                <span className="text-xs text-gray-600">80-89</span>
              </div>
              <div className="flex flex-col items-center px-3 min-w-[80px]">
                <span className="font-bold text-base">B = 8</span>
                <span className="text-xs text-gray-600">70-79</span>
              </div>
              <div className="flex flex-col items-center px-3 min-w-[80px]">
                <span className="font-bold text-base">C = 7</span>
                <span className="text-xs text-gray-600">60-69</span>
              </div>
              <div className="flex flex-col items-center px-3 min-w-[80px]">
                <span className="font-bold text-base">D = 6</span>
                <span className="text-xs text-gray-600">40-59</span>
              </div>
              <div className="flex flex-col items-center px-3 min-w-[80px]">
                <span className="font-bold text-base">F = 0</span>
                <span className="text-xs text-gray-600">&lt; 40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
