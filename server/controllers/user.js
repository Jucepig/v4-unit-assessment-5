const bcrypt = require('bcryptjs')
module.exports = {
  register: async (req,res) => {
    const db = req.app.get('db')
    const { username, password } = req.body
    const profile_pic = `https://robohash.org/${username}.png`

    const [foundUser] = await db.user.find_user_by_username(username)
    if(foundUser) {
      return res.status(409).send('Username already in use')
    }

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)

    const [newUser] = await db.user.create_user(username, hashPassword, profile_pic)
      delete newUser.password
    req.session.user = newUser
    res.status(200).send(req.session.user)
  },

  login: async (req, res) => {
    const db = req.app.get('db')
    const { username, password } = req.body

    const [existingUser] = await db.user.find_user_by_username(username)
    if(!existingUser){
      return res.status(401).send('Username not recognized')
    }

    const isAuthenticated = bcrypt.compareSync(password, existingUser.password)
    if(!isAuthenticated) {
      return res.status(403).send('Incorrect password')
    }
    delete existingUser.password
    
    req.session.user = existingUser
    res.status(200).send(req.session.user)
  },

  logout: (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
  },

  getUser: (req, res) => {
    if(req.session.user){
      return res.status(200).send(req.session.user)
    }
    res.sendStatus(404)
  }
}