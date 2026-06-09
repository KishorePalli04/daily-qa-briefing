function buildSendGridPayload({ to, from, subject, contentText, attachments = [] }) {
  const personalizations = [
    { to: [{ email: to }] }
  ];

  const payload = {
    personalizations,
    from: { email: from },
    subject: subject,
    content: [{ type: 'text/plain', value: contentText }]
  };

  if (attachments.length > 0) {
    payload.attachments = attachments.map(a => ({
      content: a.contentBase64,
      filename: a.filename,
      type: a.type || 'application/octet-stream',
      disposition: 'attachment'
    }));
  }

  return payload;
}

module.exports = { buildSendGridPayload };
