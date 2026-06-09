const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');

async function main() {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM;
  const to = process.env.EMAIL_TO;
  const reportPath = process.env.REPORT_PATH;

  if (!apiKey) {
    console.log('SENDGRID_API_KEY not set; skipping email');
    return 0;
  }
  if (!from || !to) {
    console.error('SENDGRID_FROM or EMAIL_TO not set');
    process.exit(1);
  }
  if (!reportPath) {
    console.error('REPORT_PATH not set');
    process.exit(1);
  }

  const abs = path.resolve(reportPath);
  if (!fs.existsSync(abs)) {
    console.error('Report file not found:', abs);
    process.exit(1);
  }

  const content = fs.readFileSync(abs, 'utf8');
  const b64 = Buffer.from(content).toString('base64');

  sgMail.setApiKey(apiKey);

  const msg = {
    to: to,
    from: from,
    subject: 'Daily QA Briefing',
    text: 'Attached is the daily QA briefing report.',
    attachments: [
      {
        content: b64,
        filename: path.basename(abs),
        type: 'text/html',
        disposition: 'attachment'
      }
    ]
  };

  try {
    const res = await sgMail.send(msg);
    console.log('SendGrid response status:', res && res[0] && res[0].statusCode);
    return 0;
  } catch (err) {
    console.error('SendGrid error:', err && err.response && err.response.body ? err.response.body : err);
    process.exit(1);
  }
}

main();
