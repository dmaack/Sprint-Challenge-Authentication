const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./auth-model');

const generateToken = require('./generateToken');
const authenticate = require('./authenticate-middleware');

router.post('/register', (req, res) => {
  const user = req.body;

  if(!user.username || !user.password) {
    res.status(401).json({ error: 'Bad request'})
  } else  {
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash;

    const token = generateToken(user)

    Users.add(user)
      .then(saved => {
        res.status(201).json({ user: user.username, token })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
  .first()
  .then(user => {
    if(user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user.username)

      res.status(200).json({
        message: `Welcome ${user.username}`,
        token
      })
    } else {
      res.status(401).json({ message: 'Invalid Credentials' })
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

module.exports = router;
