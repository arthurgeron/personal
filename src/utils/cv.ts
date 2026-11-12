import { jsPDF } from 'jspdf';
import { CAREER } from '../constants/career';
import {
  CV_CERTIFICATIONS,
  CV_EDUCATION,
  CV_FILE,
  CV_KEYWORDS,
  CV_LANGUAGES,
  CV_LINKS,
  CV_NAME,
  CV_OPEN_SOURCE,
  CV_PUBLICATIONS,
  CV_SKILLS,
  CV_SUMMARY,
  CV_TITLE,
} from '../constants/cv';
import { UPSTREAM } from '../constants/site';
import type { CareerRow } from '../types/interfaces';

const MARGIN = 44;
const LEADING = 1.33;
const BODY = 10;
const HANG = 9;
const SEPARATOR = '  |  ';

interface Style {
  size?: number;
  bold?: boolean;
  hang?: number;
  after?: number;
}

// the standard PDF fonts only cover Latin-1, and a parser reads a hyphen more reliably than a typographic dash
const plain = (text: string) =>
  text.replace(/[–—]/g, '-').replace(/[‘’]/g, "'");

const bulletsOf = (row: CareerRow) => [
  row.headline,
  row.body,
  ...(row.results ?? []).map((result) => `${result.figure} ${result.text}`),
];

// one column of real text in a standard font, with conventional section names, so applicant tracking systems parse it
export function saveCv() {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const page = doc.internal.pageSize;
  const width = page.getWidth() - MARGIN * 2;
  const bottom = page.getHeight() - MARGIN;
  let y = MARGIN;

  const room = (height: number) => {
    if (y + height <= bottom) return;
    doc.addPage();
    y = MARGIN;
  };
  const write = (
    text: string,
    { size = BODY, bold = false, hang = 0, after = 0 }: Style = {},
  ) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines: string[] = doc.splitTextToSize(plain(text), width - hang);
    lines.forEach((line, i) => {
      room(size * LEADING);
      y += size * LEADING;
      doc.text(line, MARGIN + (i ? hang : 0), y);
    });
    y += after;
  };
  const section = (title: string) => {
    room(60);
    y += 10;
    write(title.toUpperCase(), { size: 11, bold: true });
    doc.setDrawColor(150);
    doc.line(MARGIN, y + 4, MARGIN + width, y + 4);
    y += 6;
  };
  const bullets = (items: string[]) => {
    for (const item of items) write(`- ${item}`, { hang: HANG });
  };
  const links = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(BODY);
    y += BODY * LEADING;
    let x = MARGIN;
    CV_LINKS.forEach((url, i) => {
      const label = `${i ? SEPARATOR : ''}${url.replace(/^https:\/\/(www\.)?/, '')}`;
      doc.textWithLink(label, x, y, { url });
      x += doc.getTextWidth(label);
    });
  };

  doc.setProperties({
    title: `${CV_NAME} - CV`,
    subject: CV_TITLE,
    author: CV_NAME,
    keywords: CV_KEYWORDS,
  });
  doc.setLanguage('en-US');

  write(CV_NAME, { size: 22, bold: true, after: 2 });
  write(CV_TITLE, { size: 11 });
  links();

  section('Summary');
  write(CV_SUMMARY);

  section('Skills');
  bullets(CV_SKILLS);

  section('Experience');
  for (const row of CAREER) {
    if (!row.cv) continue;
    room(70);
    write(row.cv.title, { size: 11, bold: true });
    write(`${row.cv.company}  |  ${row.cv.from} - ${row.cv.to}`, { after: 2 });
    bullets(bulletsOf(row));
    y += 8;
  }

  section('Open Source');
  bullets([
    ...CV_OPEN_SOURCE,
    ...UPSTREAM.map((item) => `${item.name} (${item.repo}): ${item.what}.`),
  ]);

  section('Education');
  for (const school of CV_EDUCATION) {
    write(school.title, { bold: true });
    write(school.detail, { after: 4 });
  }

  section('Languages');
  bullets(CV_LANGUAGES);
  section('Certifications');
  bullets(CV_CERTIFICATIONS);
  section('Publications');
  bullets(CV_PUBLICATIONS);

  doc.save(CV_FILE);
}
