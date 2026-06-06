// PDF Generator using Puppeteer
const path = require('path');

async function ensurePuppeteer() {
  try {
    return require('puppeteer');
  } catch (err) {
    throw new Error('Puppeteer is not installed. Run `npm install puppeteer` to enable PDF generation.');
  }
}

function renderStudentHtml(report) {
  const rows = report.subjects.map(s => `
    <tr>
      <td>${s.subject}</td>
      <td style="text-align:right">${s.marks}</td>
      <td style="text-align:center">${s.grade}</td>
    </tr>`).join('');

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Report Card - ${report.studentName}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { text-align: center; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border: 1px solid #ddd; padding: 8px; }
      th { background: #f4f4f4; }
      .meta { margin-top: 10px; }
    </style>
  </head>
  <body>
    <h1>Report Card</h1>
    <div class="meta">
      <strong>Student:</strong> ${report.studentName} <br />
      <strong>Stream:</strong> ${report.stream} <br />
      <strong>Total:</strong> ${report.totalMarks} &nbsp; <strong>Average:</strong> ${report.averageMarks} &nbsp; <strong>Grade:</strong> ${report.grade}
    </div>

    <table>
      <thead>
        <tr><th>Subject</th><th>Marks</th><th>Grade</th></tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
  </html>`;
}

function renderClassHtml(report) {
  const topRows = report.topPerformers.map((p, idx) => `
    <tr><td>${idx + 1}</td><td>${p.name}</td><td style="text-align:right">${p.average}</td></tr>`).join('');

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Class Report - ${report.stream}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { text-align: center; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border: 1px solid #ddd; padding: 8px; }
      th { background: #f4f4f4; }
    </style>
  </head>
  <body>
    <h1>Class Performance Report</h1>
    <div><strong>Stream:</strong> ${report.stream}</div>
    <div><strong>Total Students:</strong> ${report.totalStudents}</div>
    <div><strong>Class Average:</strong> ${report.classAverage}</div>

    <h2>Top Performers</h2>
    <table>
      <thead><tr><th>Position</th><th>Name</th><th>Average</th></tr></thead>
      <tbody>
        ${topRows}
      </tbody>
    </table>
  </body>
  </html>`;
}

const PdfGenerator = {
  async generateStudentPdf(report) {
    const puppeteer = await ensurePuppeteer();
    const html = renderStudentHtml(report);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdf;
  },

  async generateClassPdf(report) {
    const puppeteer = await ensurePuppeteer();
    const html = renderClassHtml(report);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdf;
  },
};

module.exports = PdfGenerator;
