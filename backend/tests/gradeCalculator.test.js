const GradeCalculator = require('../src/utils/gradeCalculator');

describe('GradeCalculator', () => {
  test('calculateGrade returns correct letter for boundaries', () => {
    expect(GradeCalculator.calculateGrade(95)).toBe('A');
    expect(GradeCalculator.calculateGrade(85)).toBe('B');
    expect(GradeCalculator.calculateGrade(75)).toBe('C');
    expect(GradeCalculator.calculateGrade(65)).toBe('D');
    expect(GradeCalculator.calculateGrade(55)).toBe('E');
  });

  test('calculateGPA computes average grade point', () => {
    const gpa = GradeCalculator.calculateGPA(['A', 'B', 'C']);
    expect(gpa).toBe('3.00');
  });

  test('isPass respects threshold', () => {
    expect(GradeCalculator.isPass(50)).toBe(true);
    expect(GradeCalculator.isPass(49)).toBe(false);
  });
});
