var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bt-nodejs');

var userSchema = mongoose.Schema({
   userName: String,
   pass: String,
   email: String,
   phone: String,
   status: String,
   created: String,
});
var Users = mongoose.model("users", userSchema);

var app = express();
app.use(express.json());

app.post('/forgot-pass', function (req, res) {
   let userName = req.body.userName;
   Users.findOne({
      userName: userName
   }, function (err, response) {
      if (err) {
         return res.status(500).send("Lỗi rồi nhé!");
      } else {
         if (response) {
            const SENDGRID_API_KEY = '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'
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {
               to: response.email,
               from: 'thuanhd@htactive.com',
               subject: 'Mật khẩu của bạn',
               text:  `pass: ${response.pass}`,
               html: `Tài khoản: ${userName} <br />Mật khẩu: ${response.pass} <br /><strong>Thế là đã làm xong bài tập</strong>`,
            };
            sgMail.send(msg);
            res.send(`Đã gửi đến email: ${response.email}`);
         } else {
            res.status(404).send("Không tìm thấy!");
         }
      }
   });
});

app.listen(3000);
