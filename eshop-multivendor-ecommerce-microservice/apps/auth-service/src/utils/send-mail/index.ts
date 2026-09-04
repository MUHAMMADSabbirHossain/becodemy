import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST as string;
const SMTP_PORT = process.env.SMTP_PORT as string;
const SMTP_SERVICE = process.env.SMTP_SERVICE as string;
const SMTP_USER = process.env.SMTP_USER as string;
const SMTP_PASS = process.env.SMTP_PASS as string;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_SERVICE || !SMTP_USER || !SMTP_PASS) {
  throw new Error('Missing SMTP credentials');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  service: SMTP_SERVICE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Render an EJS email template
const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>,
): Promise<string> => {
  const templatePath: string = path.join(
    process.cwd(), // Get the current working directory - the root of the project where the package.json file is located.
    'apps',
    'auth-service',
    'src',
    'utils',
    'email-templates',
    `${templateName}.ejs`,
  );

  return ejs.renderFile(templatePath, data);
};

// Send an email using nodemailer
export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, any>,
): Promise<boolean> => {
  try {
    const html: string = await renderEmailTemplate(templateName, data);

    await transporter.sendMail({
      from: `<${SMTP_USER}`,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};
