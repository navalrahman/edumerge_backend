require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const programRoutes = require('./routes/program/ProgramRoute');
const admissionRoutes = require('./routes/admission/AdmissionRoute');
const dashboardRoutes = require('./routes/dashboard/DashboardRoute');
const authRoutes = require('./routes/admin/AdminRoute');

const app = express();

// Since cookies are being passed to frontend, we might need credentials in CORS
app.use(cors({ origin: true, credentials: true }));

// app.use(cors({
//   origin: "http://localhost:3000", // your frontend
//   credentials: true
// }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edumerge_db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

app.use('/api/v1', authRoutes);
app.use('/api/v1', programRoutes);
app.use('/api/v1', admissionRoutes);
app.use('/api/v1', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
