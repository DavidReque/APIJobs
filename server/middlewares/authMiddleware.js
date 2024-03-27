import jwt from 'jsonwebtoken'

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error(err)
      return res.sendStatus(403)
    }

    req.user = user
    next()
  })
}
