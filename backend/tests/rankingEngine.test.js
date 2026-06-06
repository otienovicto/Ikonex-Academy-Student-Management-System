const RankingEngine = require('../src/utils/rankingEngine');

describe('RankingEngine', () => {
  test('rankByAverage assigns dense ranks with ties', () => {
    const students = [
      { student_id: 1, first_name: 'A', last_name: 'One', average: 90, total: 270 },
      { student_id: 2, first_name: 'B', last_name: 'Two', average: 90, total: 260 },
      { student_id: 3, first_name: 'C', last_name: 'Three', average: 85, total: 255 },
    ];

    const ranked = RankingEngine.rankByAverage(students);
    const pos1 = ranked.find((r) => r.student_id === 1).position;
    const pos2 = ranked.find((r) => r.student_id === 2).position;
    const pos3 = ranked.find((r) => r.student_id === 3).position;

    expect(pos1).toBe(1);
    expect(pos2).toBe(1);
    expect(pos3).toBe(2);
  });

  test('rankByMarks assigns dense ranks with ties', () => {
    const scores = [
      { student_id: 1, marks: 95 },
      { student_id: 2, marks: 95 },
      { student_id: 3, marks: 88 },
    ];

    const ranked = RankingEngine.rankByMarks(scores);
    expect(ranked.find((r) => r.student_id === 1).position).toBe(1);
    expect(ranked.find((r) => r.student_id === 2).position).toBe(1);
    expect(ranked.find((r) => r.student_id === 3).position).toBe(2);
  });
});
