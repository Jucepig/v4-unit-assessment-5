require('dotenv').config();
const massive = require('massive')
const express = require('express'),
      userCtrl = require('./controllers/user'),
      postCtrl = require('./controllers/posts')
const { SERVER_PORT, CONNECTION_STRING } = process.env

const app = express();

app.use(express.json());


massive({
  connectionString: CONNECTION_STRING,
  ssl: {rejectUnauthorized: false}
}).then(db => {
  console.log('Database Connected')
  app.set('db', db)
  app.listen(SERVER_PORT, _ => console.log(`running on ${SERVER_PORT}`));
})

//Auth Endpoints
app.post('/api/auth/register', userCtrl.register);
app.post('/api/auth/login', userCtrl.login);
app.get('/api/auth/me', userCtrl.getUser);
app.post('/api/auth/logout', userCtrl.logout);

//Post Endpoints
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost)

app.listen(SERVER_PORT, _ => console.log(`running on ${SERVER_PORT}`));