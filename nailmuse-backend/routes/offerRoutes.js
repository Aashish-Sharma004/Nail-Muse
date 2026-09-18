// routes/offerRoutes.js
const router = require('express').Router();
const nodemailer = require('nodemailer');
const OfferCampaign = require('../models/OfferCampaign');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Helper to generate the luxury NailMuse Studio email HTML template
function buildEmailTemplate({ headline, message, promoCode, discount, validUntil, recipientEmail }) {
  const clientName = recipientEmail ? recipientEmail.split('@')[0] : 'Valued Client';
  const siteUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline || 'Exclusive Offer from NailMuse'}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2B1E16;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(43,30,22,0.08); border: 1px solid #EDE5D8;">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #2B1E16 0%, #3d2a1e 100%); padding: 36px 20px; color: #FAF8F5;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; letter-spacing: 1px; color: #FAF8F5; display: block;">
                      NailMuse Studio
                    </span>
                    <span style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #d4956b; margin-top: 6px; display: block; font-weight: bold;">
                      Boutique Nail Spa & Atelier
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="font-size: 14px; color: #6B5344; margin-top: 0; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;">
                Special Invitation for ${clientName}
              </p>

              <h1 style="font-family: Georgia, serif; font-size: 24px; color: #2B1E16; line-height: 1.3; margin-top: 0; margin-bottom: 18px;">
                ${headline || 'A Treat Just for You'}
              </h1>

              <div style="font-size: 15px; line-height: 1.7; color: #4A3B32; margin-bottom: 28px; white-space: pre-line;">
                ${message}
              </div>

              <!-- Promo Voucher Box -->
              ${promoCode ? `
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; border: 2px dashed #d4956b; border-radius: 18px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    ${discount ? `<span style="display: inline-block; background-color: #2B1E16; color: #FAF8F5; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 100px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">${discount}</span><br>` : ''}
                    <span style="font-size: 12px; color: #6B5344; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; display: block; margin-bottom: 6px;">Your Promo Code</span>
                    <span style="font-family: 'Courier New', monospace; font-size: 26px; font-weight: bold; color: #2B1E16; letter-spacing: 4px; display: inline-block; background-color: #ffffff; padding: 8px 20px; border-radius: 10px; border: 1px solid #EDE5D8;">
                      ${promoCode}
                    </span>
                    ${validUntil ? `<p style="font-size: 12px; color: #8A7363; margin-top: 10px; margin-bottom: 0;">Valid through: <strong>${validUntil}</strong></p>` : ''}
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Book Now CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/services" style="display: inline-block; background-color: #2B1E16; color: #FAF8F5; text-decoration: none; font-size: 14px; font-weight: bold; padding: 14px 34px; border-radius: 14px; box-shadow: 0 4px 14px rgba(43,30,22,0.25);">
                      Book Your Treatment &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #8A7363; text-align: center; margin: 0;">
                Simply apply code <strong style="color: #2B1E16;">${promoCode || 'at studio'}</strong> during booking or mention it to your technician.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF8F5; border-top: 1px solid #EDE5D8; padding: 24px 32px; text-align: center; font-size: 11px; color: #8A7363; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: bold; color: #2B1E16;">NailMuse Studio & Lounge</p>
              <p style="margin: 0 0 6px 0;">452 Beverly Blvd, Suite 200, Los Angeles, CA • +1 (555) 342-6873</p>
              <p style="margin: 0; color: #A89585;">You received this exclusive client perk because you're a registered member of NailMuse VIP Club.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// POST send direct offer email(s) to customers
router.post('/send', async (req, res) => {
  try {
    const {
      recipientType = 'all',
      targetEmail,
      targetTier,
      subject,
      headline,
      message,
      promoCode,
      discount,
      validUntil,
      sentBy = 'admin@nailmuse.com'
    } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    // Determine recipient emails
    let recipientEmails = [];

    if (recipientType === 'individual') {
      if (!targetEmail || !targetEmail.includes('@')) {
        return res.status(400).json({ error: 'Valid target customer email is required' });
      }
      recipientEmails = [targetEmail.trim().toLowerCase()];
    } else if (recipientType === 'tier') {
      const tierUsers = await User.find({ tier: targetTier || 'Gold VIP Member' });
      recipientEmails = tierUsers.map(u => u.email.trim().toLowerCase());
    } else {
      // Broadcast to all users in User collection + unique customer emails from Bookings
      const users = await User.find();
      const bookings = await Booking.find();
      
      const emailSet = new Set();
      users.forEach(u => {
        if (u.email && u.email.includes('@')) emailSet.add(u.email.trim().toLowerCase());
      });
      bookings.forEach(b => {
        if (b.userEmail && b.userEmail.includes('@')) emailSet.add(b.userEmail.trim().toLowerCase());
      });

      recipientEmails = Array.from(emailSet);
    }

    if (recipientEmails.length === 0) {
      return res.status(400).json({ error: 'No recipients found for this audience selection' });
    }

    // Set up nodemailer transporter
    let transporter;
    let previewUrl = '';

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Use Ethereal test account for realistic email dispatch & live preview URLs
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      } catch (testErr) {
        console.warn('Ethereal test account failed, using jsonTransport:', testErr.message);
        transporter = nodemailer.createTransport({ jsonTransport: true });
      }
    }

    // Send emails (batch / sample dispatch)
    const emailPromises = recipientEmails.map(email => {
      const htmlContent = buildEmailTemplate({
        headline,
        message,
        promoCode,
        discount,
        validUntil,
        recipientEmail: email
      });

      return transporter.sendMail({
        from: '"NailMuse Studio" <offers@nailmuse.com>',
        to: email,
        subject: subject,
        html: htmlContent,
        text: `${headline || 'Exclusive Offer'}\n\n${message}\n\nPromo Code: ${promoCode || 'N/A'}\nDiscount: ${discount || ''}\nValid Until: ${validUntil || ''}`
      });
    });

    const results = await Promise.allSettled(emailPromises);
    const successfulSends = results.filter(r => r.status === 'fulfilled');

    // Extract test preview URL if available
    const firstFulfilled = results.find(r => r.status === 'fulfilled');
    if (firstFulfilled?.value) {
      previewUrl = nodemailer.getTestMessageUrl(firstFulfilled.value) || '';
    }

    // Save Campaign History in MongoDB
    const campaign = new OfferCampaign({
      subject,
      headline: headline || 'Exclusive Salon Offer',
      message,
      promoCode: promoCode || '',
      discount: discount || '',
      validUntil: validUntil || '',
      recipientType,
      recipients: recipientEmails,
      recipientCount: recipientEmails.length,
      sentBy,
      previewUrl,
      status: 'Sent'
    });

    await campaign.save();

    res.status(201).json({
      message: `Offer sent successfully to ${recipientEmails.length} customer(s)!`,
      campaign,
      previewUrl,
      successfulCount: successfulSends.length
    });

  } catch (err) {
    console.error('Error sending offer:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET all past sent offer campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await OfferCampaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove a campaign log
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await OfferCampaign.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Campaign log not found' });
    }
    res.json({ message: 'Campaign log deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
