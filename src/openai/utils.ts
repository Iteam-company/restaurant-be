import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

export async function extractTextFromImage(
  file: Express.Multer.File,
): Promise<string> {
  const { data } = await Tesseract.recognize(file.buffer, 'eng');
  return data.text;
}

export async function extractTextFromDocx(
  file: Express.Multer.File,
): Promise<string> {
  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return result.value;
}

export async function extractTextFromPdf(
  file: Express.Multer.File,
): Promise<string> {
  const data = await (pdfParse as any)(file.buffer);
  return data.text;
}
