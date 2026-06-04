import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './vigilquad.sqlite',
  logging: false 
});

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },

  examAttempted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

const ExamSession = sequelize.define('ExamSession', {
  username: { type: DataTypes.STRING, allowNull: false },

  finalScore: { type: DataTypes.FLOAT, allowNull: false },

  rightAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },

  wrongAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },

  accuracy: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },

  warningsCount: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

sequelize.sync().then(() => console.log('🟢 SQLite Backend Ready.'));

const JWT_SECRET = 'VIGILQUAD_SUPER_SECRET_TOKEN';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) { res.status(500).json({ error: 'Registration failed.' }); }
});

app.post('/api/auth/login', async (req, res) => {

  const user = await User.findOne({
    where: { username: req.body.username }
  });

  if (
    !user ||
    !(await bcrypt.compare(
      req.body.password,
      user.password
    ))
  ) {
    return res.status(400).json({
      error: 'Invalid credentials.'
    });
  }

 if (user.examAttempted) {
  return res.status(403).json({
    error:
      'Exam already attempted. Further attempts are not allowed.'
  });
}

  const token = jwt.sign(
    { username: user.username },
    JWT_SECRET
  );

  res.json({
    token,
    username: user.username
  });

});
app.post(
  '/api/exam/start',
  authenticateToken,
  async (req, res) => {

    await User.update(
      {
        examAttempted: true
      },
      {
        where: {
          username: req.user.username
        }
      }
    );

    res.json({
      message: 'Exam session started.'
    });

  }
);
app.post('/api/exam/submit', authenticateToken, async (req, res) => {

  try {

    const {

      finalScore,
      rightAnswers,
      wrongAnswers,
      warningsCount

    } = req.body;

    const totalQuestions =
      rightAnswers + wrongAnswers;

    const accuracy =
      totalQuestions > 0
        ? (rightAnswers / totalQuestions) * 100
        : 0;

    await ExamSession.create({

      username: req.user.username,

      finalScore,

      rightAnswers,

      wrongAnswers,

      accuracy,

      warningsCount

    });

    res.status(201).json({
      message: 'Telemetry recorded.'
    });

  } catch (err) {

    res.status(500).json({
      error: 'Failed to save.'
    });

  }

});
app.get('/api/admin/results', async (req, res) => {

  try {

    const results = await ExamSession.findAll();

    console.log(results);

    res.json(results);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.listen(5000, () => console.log('🚀 Backend active on port 5000'));