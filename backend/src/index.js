const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser

// Routes
app.use('/api/tasks', taskRoutes);

// Render Health Check endpoint (Root)
app.get('/', (req, res) => {
  res.json({
    status: "success",
    message: "TaskFlow API is running 🚀"
  });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
