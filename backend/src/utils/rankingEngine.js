// Ranking Engine with dense tie-aware ranking
const RankingEngine = {
  // students: array of { student_id, first_name, last_name, average, total }
  rankByAverage(students) {
    const normalized = students.map((s) => ({
      student_id: s.student_id || s.id || s.studentId,
      first_name: s.first_name || s.firstName || s.name?.split?.(' ')[0] || null,
      last_name: s.last_name || s.lastName || s.name?.split?.(' ')[1] || null,
      average: Number(Number(s.average || 0).toFixed(2)),
      total: Number(Number(s.total || s.totalMarks || 0).toFixed(2)),
    }));

    normalized.sort((a, b) => {
      if (b.average === a.average) return b.total - a.total;
      return b.average - a.average;
    });

    const results = [];
    let position = 0;
    let lastAvg = null;
    for (const row of normalized) {
      if (lastAvg === null || row.average !== lastAvg) {
        position += 1; // dense ranking: increment by 1 for a new distinct average
        lastAvg = row.average;
      }
      results.push({
        student_id: row.student_id,
        first_name: row.first_name,
        last_name: row.last_name,
        average: row.average,
        total: row.total,
        position,
      });
    }

    return results;
  },

  // scores: array of { student_id, first_name, last_name, marks }
  rankByMarks(scores) {
    const normalized = scores.map((s) => ({
      student_id: s.student_id || s.id || s.studentId,
      first_name: s.first_name || s.firstName || null,
      last_name: s.last_name || s.lastName || null,
      marks: Number(Number(s.marks || s.mark || 0).toFixed(2)),
    }));

    normalized.sort((a, b) => b.marks - a.marks);

    const results = [];
    let position = 0;
    let lastMark = null;
    for (const row of normalized) {
      if (lastMark === null || row.marks !== lastMark) {
        position += 1;
        lastMark = row.marks;
      }
      results.push({
        student_id: row.student_id,
        first_name: row.first_name,
        last_name: row.last_name,
        marks: row.marks,
        position,
      });
    }

    return results;
  },
};

module.exports = RankingEngine;
