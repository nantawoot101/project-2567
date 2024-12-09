const nodemailer = require('nodemailer');

// สร้าง transporter สำหรับส่งอีเมล
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e9045be949e31a",
    pass: "e11bce2121e7d2"
  }
});

exports.sendEmail = async (req, res) => {
  const { name, email, phoneNumber, message } = req.body;

  try {
    // ส่งอีเมล์
    await transporter.sendMail({
      from: email,
      to: 'mosso45180@gmail.com', // อีเมลล์ที่จะส่งไป
      subject: `</devphone> คุณได้รับข้อความใหม่จาก ${name}`,
      html: `
        <p>${message}</p>
        <i>${phoneNumber}</i>
      `,
    });

    console.log("Email sent successfully");
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};
