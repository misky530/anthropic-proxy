const express = require('express')
const authRouter = require('./api/auth')

const app = express()
app.use(express.json())
app.use('/api/auth', authRouter)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
