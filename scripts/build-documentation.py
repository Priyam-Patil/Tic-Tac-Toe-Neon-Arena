"""Build the PDF from the repository's Markdown documentation and real screenshots.

Requires reportlab. Run from the project root:
    python scripts/build-documentation.py
"""
from pathlib import Path
from html import escape
import re
import reportlab

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image,
    PageBreak, KeepTogether, Flowable,
)

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs' / 'PROJECT_DOCUMENTATION.md'
OUTPUT = ROOT / 'output' / 'pdf' / 'Tic-Tac-Toe-Neon-Arena-Documentation.pdf'
NAVY = colors.HexColor('#202c4c')
BLUE = colors.HexColor('#4963db')
PURPLE = colors.HexColor('#6453cf')
MUTED = colors.HexColor('#68738b')
PALE = colors.HexColor('#f0f2fc')
BORDER = colors.HexColor('#dfe4f1')
FONT_DIR = Path(reportlab.__file__).resolve().parent / 'fonts'
pdfmetrics.registerFont(TTFont('ArenaSans', str(FONT_DIR / 'Vera.ttf')))
pdfmetrics.registerFont(TTFont('ArenaSans-Bold', str(FONT_DIR / 'VeraBd.ttf')))
pdfmetrics.registerFont(TTFont('ArenaSans-Italic', str(FONT_DIR / 'VeraIt.ttf')))
pdfmetrics.registerFont(TTFont('ArenaSans-BoldItalic', str(FONT_DIR / 'VeraBI.ttf')))
pdfmetrics.registerFontFamily('ArenaSans', normal='ArenaSans', bold='ArenaSans-Bold', italic='ArenaSans-Italic', boldItalic='ArenaSans-BoldItalic')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyDoc', fontName='Helvetica', fontSize=10, leading=15, textColor=NAVY, spaceAfter=8))
styles.add(ParagraphStyle(name='H1Doc', fontName='Helvetica-Bold', fontSize=22, leading=28, textColor=NAVY, spaceAfter=16))
styles.add(ParagraphStyle(name='H2Doc', fontName='Helvetica-Bold', fontSize=13, leading=18, textColor=PURPLE, spaceBefore=12, spaceAfter=8, keepWithNext=True))
styles.add(ParagraphStyle(name='CodeDoc', fontName='Courier', fontSize=8, leading=12, textColor=NAVY, backColor=PALE, borderPadding=9, spaceAfter=12))
styles.add(ParagraphStyle(name='CellDoc', fontName='Helvetica', fontSize=8, leading=11, textColor=NAVY, spaceAfter=0))
styles.add(ParagraphStyle(name='CaptionDoc', fontName='Helvetica', fontSize=8.5, leading=12, textColor=MUTED, alignment=TA_CENTER, spaceAfter=15))
styles.add(ParagraphStyle(name='CoverTitle', fontName='Helvetica-Bold', fontSize=38, leading=43, textColor=NAVY, spaceAfter=20))
styles.add(ParagraphStyle(name='CoverSub', fontName='Helvetica', fontSize=15, leading=23, textColor=PURPLE, spaceAfter=18))
for style_name in ['BodyDoc', 'H1Doc', 'H2Doc', 'CellDoc', 'CaptionDoc', 'CoverTitle', 'CoverSub']:
    styles[style_name].fontName = 'ArenaSans-Bold' if 'Bold' in styles[style_name].fontName else 'ArenaSans'


def clean(text):
    return text.replace('\u2014', '-').replace('\u2013', '-').replace('\u2011', '-').replace('\u2019', "'").replace('\u2018', "'").replace('\u201c', '"').replace('\u201d', '"').replace('\u2192', ' -> ').replace('\u00d7', ' x ')


def inline(text):
    text = escape(clean(text))
    text = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<a href="\2" color="#4963db">\1</a>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'`([^`]+)`', r'<font name="Courier" size="8.5">\1</font>', text)
    return text


class FlowDiagram(Flowable):
    def __init__(self):
        super().__init__()
        self.width = 465
        self.height = 220

    def draw(self):
        canvas = self.canv
        labels = ['Choose mode, players, difficulty, and starting mark',
                  'Validate move -> place X or O -> switch turn',
                  'Check eight winning lines and full-board draw',
                  'Continue play / AI response, or save one final result',
                  'Show result -> Play again, Home, statistics, or replay']
        for i, label in enumerate(labels):
            y = self.height - 38 - i * 44
            canvas.setFillColor(PALE)
            canvas.setStrokeColor(BORDER)
            canvas.roundRect(6, y, 451, 32, 8, fill=1, stroke=1)
            canvas.setFillColor(NAVY)
            canvas.setFont('ArenaSans', 9)
            canvas.drawCentredString(231, y + 12, label)
            if i < len(labels) - 1:
                canvas.setStrokeColor(BLUE)
                canvas.line(231, y - 1, 231, y - 10)
                canvas.line(231, y - 10, 228, y - 7)
                canvas.line(231, y - 10, 234, y - 7)


def page_decoration(canvas, doc):
    canvas.saveState()
    if doc.page == 1:
        canvas.setFillColor(PURPLE)
        canvas.rect(0, 785, 595.28, 57, fill=1, stroke=0)
        canvas.setFillColor(colors.white)
        canvas.setFont('ArenaSans-Bold', 10)
        canvas.drawString(50, 810, 'NEON ARENA / PROJECT DOCUMENTATION')
    else:
        canvas.setFillColor(MUTED)
        canvas.setFont('ArenaSans', 8)
        canvas.drawString(50, 810, 'TIC TAC TOE - NEON ARENA')
        canvas.drawRightString(545, 810, 'Priyam Patil | React Web Application')
        canvas.setStrokeColor(BORDER)
        canvas.line(50, 800, 545, 800)
    canvas.setStrokeColor(BORDER)
    canvas.line(50, 43, 545, 43)
    canvas.setFont('ArenaSans', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(50, 29, 'Verified local release | GitHub push and Vercel deployment require approval')
    canvas.drawRightString(545, 29, str(doc.page))
    canvas.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    text = SOURCE.read_text(encoding='utf-8')
    lines = text.splitlines()
    story = [Spacer(1, 65), Paragraph('Tic Tac Toe<br/>Neon Arena', styles['CoverTitle']),
             Paragraph('React Web Application', styles['CoverSub']),
             Paragraph('Author: <b>Priyam Patil</b><br/>Release verification: 15 November 2026', styles['BodyDoc']),
             Spacer(1, 18), Paragraph('<b>GitHub repository</b><br/><a href="https://github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena" color="#4963db">github.com/Priyam-Patil/Tic-Tac-Toe-Neon-Arena</a>', styles['BodyDoc']),
             Paragraph('<b>Live website</b><br/>Not deployed - awaiting owner approval. No live URL has been invented.', styles['BodyDoc']),
             Spacer(1, 25), Paragraph('A compact game. A complete engineering story.', styles['CoverSub']),
             Paragraph('Rules, intelligent AI, interface design, persistence, accessibility, production verification, security, and publication handoff - documented from the actual source.', styles['BodyDoc']),
             Spacer(1, 20), Paragraph('<b>Publication status:</b> local verification complete; repository push and Vercel deployment are pending explicit approval. This PDF will be updated with the real live URL after deployment is verified.', styles['BodyDoc']), PageBreak()]
    sections = [clean(line[3:]) for line in lines if line.startswith('## ')]
    story.append(Paragraph('Contents', styles['H1Doc']))
    for item in sections:
        story.append(Paragraph(inline(item), styles['BodyDoc']))
    story.extend([Spacer(1, 18), Paragraph('Evidence standard', styles['H2Doc']), Paragraph('Pass means the check was actually executed. Not tested and Pending are used where physical hardware, approval, authentication, or a live deployment is still required. Screenshots show real application states, not interface mockups.', styles['BodyDoc'])])
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip() or line.startswith('# '):
            i += 1
            continue
        if line.startswith('## '):
            story.extend([PageBreak(), Paragraph(inline(line[3:]), styles['H1Doc'])])
        elif line.startswith('### '):
            story.append(Paragraph(inline(line[4:]), styles['H2Doc']))
        elif line.startswith('```'):
            code = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                # Non-breaking spaces preserve code/tree indentation in Paragraph.
                code.append(escape(clean(lines[i])).replace(' ', '&#160;'))
                i += 1
            story.append(Paragraph('<br/>'.join(code) or '&#160;', styles['CodeDoc']))
        elif line.startswith('!['):
            match = re.match(r'!\[([^\]]*)\]\(([^)]+)\)', line)
            if match:
                label, filename = match.groups()
                img_path = SOURCE.parent / filename
                if not img_path.exists():
                    raise FileNotFoundError(img_path)
                image = Image(str(img_path))
                scale = min(475 / image.imageWidth, 550 / image.imageHeight)
                image.drawWidth = image.imageWidth * scale
                image.drawHeight = image.imageHeight * scale
                story.append(KeepTogether([image, Spacer(1, 7), Paragraph(inline(label), styles['CaptionDoc'])]))
        elif line.strip() == '[GAME_FLOW]':
            story.append(FlowDiagram())
        elif line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [cell.strip() for cell in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r'[:\- ]+', c) for c in cells):
                    rows.append([Paragraph(inline(cell), styles['CellDoc']) for cell in cells])
                i += 1
            i -= 1
            count = len(rows[0])
            widths = [72, 125, 106, 112, 60] if count == 5 else [475 / count] * count
            table = Table(rows, colWidths=widths, repeatRows=1, hAlign='LEFT')
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), PALE), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('GRID', (0, 0), (-1, -1), .4, BORDER),
                ('LEFTPADDING', (0, 0), (-1, -1), 7), ('RIGHTPADDING', (0, 0), (-1, -1), 7),
                ('TOPPADDING', (0, 0), (-1, -1), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fafbfe')]),
            ]))
            story.extend([table, Spacer(1, 12)])
        else:
            if line.startswith('- '):
                story.append(Paragraph('&#8226; ' + inline(line[2:]), styles['BodyDoc']))
            else:
                story.append(Paragraph(inline(line), styles['BodyDoc']))
        i += 1
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=(595.28, 841.89), rightMargin=60, leftMargin=60,
                            topMargin=62, bottomMargin=62, title='Tic Tac Toe - Neon Arena Documentation',
                            author='Priyam Patil', subject='Verified React application documentation', pageCompression=1)
    doc.build(story, onFirstPage=page_decoration, onLaterPages=page_decoration)
    print(OUTPUT)


if __name__ == '__main__':
    build()
