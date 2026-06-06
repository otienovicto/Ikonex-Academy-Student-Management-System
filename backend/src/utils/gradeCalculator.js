// Grade Calculator
const GradeCalculator = {
  // Standard thresholds: A:90+, B:80-89.99, C:70-79.99, D:60-69.99, E:<60
  calculateGrade(marks) {
    const m = Number(marks);
    if (Number.isNaN(m)) return null;
    if (m >= 90) return 'A';
    if (m >= 80) return 'B';
    if (m >= 70) return 'C';
    if (m >= 60) return 'D';
    return 'E';
  },

  // Calculate GPA from an array of letter grades (A..E)
  calculateGPA(grades) {
    const gradePoints = {
      A: 4.0,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      E: 0.0,
    };

    if (!Array.isArray(grades) || grades.length === 0) return '0.00';
    const totalPoints = grades.reduce((sum, grade) => sum + (gradePoints[grade] || 0), 0);
    return (totalPoints / grades.length).toFixed(2);
  },

  // Pass threshold remains 50 by convention
  isPass(marks) {
    return Number(marks) >= 50;
  },
};

module.exports = GradeCalculator;
