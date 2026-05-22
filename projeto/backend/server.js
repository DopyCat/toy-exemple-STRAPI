const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/api/status', (req,res)=>{
  res.json({
    mensagem:"Backend funcionando"
  })
})

app.listen(4000, ()=>{
  console.log('rodando 4000')
})