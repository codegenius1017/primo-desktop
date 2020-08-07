const express = require('express')
const cors = require('cors')({ origin: true })
const app = express()
const bodyParser = require('body-parser')

const processPostCSS = require('primo-functions').default.processPostCSS

app.use(cors)

app.use(bodyParser.json())

app.post('/postcss', async (req, res) => {
  let { css, html, options } = req.body
  const result = await processPostCSS(css, html, options)
  console.log(result)
  res.send(result)
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`primo functions are being served on port ${PORT}`)
})