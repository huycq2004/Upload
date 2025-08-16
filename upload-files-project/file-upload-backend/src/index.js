const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const uploadRoutes = require('./routes/upload');
const downloadRoute = require('./routes/download');
const deleteRoute = require('./routes/deleteUser');
const loginRoute = require('./routes/login');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

app.use('/api/upload', uploadRoutes);
app.use('/downloads', downloadRoute);
app.use('/api/delete', deleteRoute);
app.use('/api/login', loginRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
