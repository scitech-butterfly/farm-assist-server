require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const schemesRoutes = require('./routes/schemes');
const applicationsRoutes = require('./routes/applications');
const feedbackRoutes = require('./routes/feedback');
const queryRoutes = require('./routes/queryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/query', queryRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log('Server listening on', PORT));
  })
  .catch(err => console.error('DB connect error', err));
