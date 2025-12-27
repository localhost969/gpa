import React from 'react';

interface Course {
  name: string;
  credits: number;
  type: 'theory' | 'lab';
}

interface MarkRange {
  grade: string;
  range: string;
  description: string;
}

interface CourseRowProps {
  course: Course;
  grade: string;
  onGradeChange: (value: string) => void;
  markRanges: MarkRange[];
}

export const CourseRow: React.FC<CourseRowProps> = ({ course, grade, onGradeChange, markRanges }) => {
  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-black last:border-b-0 hover:bg-gray-50 transition-colors gap-2 sm:gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-bold text-sm sm:text-base truncate-2-lines leading-tight">
            {course.name}
          </h3>
          <span className="inline-flex items-center px-1.5 py-0.5 border border-black text-[10px] font-mono font-bold uppercase tracking-wider bg-white whitespace-nowrap">
            {course.credits} CR
          </span>
        </div>
      </div>
      
      <div className="w-full sm:w-48 flex-shrink-0">
        <div className="relative">
          <select
            value={grade || ''}
            onChange={(e) => onGradeChange(e.target.value)}
            className="appearance-none w-full bg-white border border-black px-3 py-2 pr-8 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 cursor-pointer hover:bg-gray-50 transition-all"
          >
            <option value="" className="text-gray-400">Select Grade</option>
            {course.type === 'theory' ? (
              markRanges.map(range => (
                <option key={range.grade} value={range.grade}>
                  {range.grade} ({range.range})
                </option>
              ))
            ) : (
              <>
                <option value="S">S (10)</option>
                <option value="A">A (9)</option>
                <option value="B">B (8)</option>
                <option value="C">C (7)</option>
                <option value="D">D (6)</option>
                <option value="E">E (5)</option>
                <option value="F">F (0)</option>
              </>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
