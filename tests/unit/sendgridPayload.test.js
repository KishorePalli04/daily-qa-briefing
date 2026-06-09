const { buildSendGridPayload } = require('../../src/sendgridPayload');

describe('buildSendGridPayload', () => {
  test('builds minimal payload without attachments', () => {
    const p = buildSendGridPayload({
      to: 'pallikishore4@gmail.com',
      from: 'reports@notify.kishorepalli.com',
      subject: 'Test',
      contentText: 'Hello'
    });

    expect(p).toHaveProperty('personalizations');
    expect(p.personalizations[0].to[0].email).toBe('pallikishore4@gmail.com');
    expect(p.from.email).toBe('reports@notify.kishorepalli.com');
    expect(p.subject).toBe('Test');
    expect(p.content[0].value).toBe('Hello');
    expect(p).not.toHaveProperty('attachments');
  });

  test('includes attachments when provided', () => {
    const fakeBase64 = Buffer.from('<html>ok</html>').toString('base64');
    const p = buildSendGridPayload({
      to: 'a@b.com',
      from: 'x@y.com',
      subject: 'S',
      contentText: 'C',
      attachments: [{ contentBase64: fakeBase64, filename: 'report.html', type: 'text/html' }]
    });

    expect(p.attachments).toHaveLength(1);
    expect(p.attachments[0].content).toBe(fakeBase64);
    expect(p.attachments[0].filename).toBe('report.html');
    expect(p.attachments[0].type).toBe('text/html');
  });
});
