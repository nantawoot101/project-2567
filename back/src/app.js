require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRouter = require('./routes/auth-router');
const roleRouter = require('./routes/role-router');
const authAdminRouter = require('./routes/auth-admin-router');
const projectRouter = require('./routes/project-router');
const docRouter = require('./routes/doc-router'); // รวมเส้นทางสำหรับ doc
const creatorRouter = require('./routes/creator-router');
const expertRouter = require('./routes/expert-router');
const chairmanRouter = require('./routes/chairman-router');
const advisorRouter = require('./routes/advisor-router');
const viewRouter = require('./routes/view-router');
const dowloadRouter = require('./routes/dowload-router');

const app = express()

// Middleware
app.use(cors());

app.use(express.json())
const path = require('path');

// Routes
app.use('/auth', authRouter);
app.use('/role', roleRouter);
app.use('/admin', authAdminRouter);
app.use('/project', projectRouter);
app.use('/docs', docRouter); // เส้นทางสำหรับ doc
app.use('/creator', creatorRouter);
app.use('/expert', expertRouter);
app.use('/chairman', chairmanRouter);
app.use('/advisor', advisorRouter);
app.use('/view', viewRouter);
app.use('/dowload', dowloadRouter);

// ใช้ middleware เพื่อให้บริการไฟล์ PDF จากโฟลเดอร์ 'uploads/docs'
app.use('/files', express.static('uploads/docs'));
app.use('/auth', express.static('uploads/profile'));


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

let port = process.env.PORT || 8000
app.listen(port, () => console.log('Server on Port :', port))
