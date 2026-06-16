import config from '../config';

let resend: any = null;

const getResendClient = () => {
  if (!resend && config.resendApiKey) {
    try {
      const { Resend } = require('resend');
      resend = new Resend(config.resendApiKey);
    } catch {
      console.warn('Resend package not available. Email notifications disabled.');
    }
  }
  return resend;
};

export const sendLeaveStatusEmail = async (
  to: string,
  employeeName: string,
  status: string,
  fromDate: string,
  toDate: string
): Promise<void> => {
  const client = getResendClient();
  if (!client) {
    console.warn('Email not configured. Skipping leave notification.');
    return;
  }

  try {
    await client.emails.send({
      from: 'EMS <onboarding@resend.dev>',
      to: [to],
      subject: `Leave Request ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Leave Request Update</h2>
          <p>Dear ${employeeName},</p>
          <p>Your leave request has been <strong>${status.toLowerCase()}</strong>.</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>From:</strong> ${fromDate}</p>
            <p><strong>To:</strong> ${toDate}</p>
            <p><strong>Status:</strong> ${status}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">— Employee Management System</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send leave status email:', error);
  }
};
