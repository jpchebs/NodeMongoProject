const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = require('../../.env')

// Validar o formato do Email
const emailRegex = /\S+@\S+\.\S+/
// Validar o formato da senha
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,12})/

// Método para tratar erros que possa vir do MongoDB
const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({errors})
}

const login = (req, res, next) => {

  // Pegando o email e a senha no body da requisição
  const email = req.body.email || ''
  const password = req.body.password || ''

  // Consultando na collection de 'user' por 'email'
  User.findOne({email}, (err, user) => {
    if(err) {
      // Retorna erro do banco caso ocorra
      return sendErrorsFromDB(res, err)
      // Caso o usuário seja obtido com sucesso
      // Compara a senha obtida(limpa) com a senha do banco(encriptada) usando o bcrypt
    } else if (user && bcrypt.compareSync(password, user.password)) {
      // Gerando um token com tempo de expiração
      // Usando a chave do authSecret para identificar a aplicação
      const token = jwt.sign(user, env.authSecret, {
        expiresIn: "1 day"
      })
      // Extraindo atributos do usuário
      const { name, email } = user
      // Enviando atributos
      res.json({ name, email, token })
      // Caso retorna 'null' ou a comparação foi 'false'
    } else {
      return res.status(400).send({errors: ['Usuário/Senha inválidos']})
    }
  })
}

// Método para validar token
const validateToken = (req, res, next) => {
  // Recebendo token
  const token = req.body.token || ''
  // Verificando o token
  jwt.verify(token, env.authSecret, function(err, decoded) {
    return res.status(200).send({valid: !err})
  })
}

// Função Cadastro de Usuário
const signup = (req, res, next) => {
  // Pegando itens do login
  const name = req.body.name || ''
  const email = req.body.email || ''
  const password = req.body.password || ''
  const confirmPassword = req.body.confirm_password || ''

  // Validação do Email
  if(!email.match(emailRegex)) {
    return res.status(400).send({errors: ['O e-mail informado está inválido']})
  }

  // Validação da Senha
  if(!password.match(passwordRegex)) {
    return res.status(400).send({errors: [
      "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-12."
    ]})
  }

  // 'salt' valor randômico usado para geração do hash baseado na senha
  const salt = bcrypt.genSaltSync()
  const passwordHash = bcrypt.hashSync(password, salt)
  // Comparando a confirmação da senha com hash
  if(!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({errors: ['Senhas não conferem.']})
  }

  // Método para verificar se o email já está cadastrado no banco antes de novo cadastrado
  User.findOne({email}, (err, user) => {
    if(err) {
      return sendErrorsFromDB(res, err)
    } else if (user) {
      return res.status(400).send({errors: ['Usuário já cadastrado.']})
    } else {
      const newUser = new User({ name, email, password: passwordHash })
      newUser.save(err => {
        if(err) {
          return sendErrorsFromDB(res, err)
        } else {
          login(req, res, next)
        }
      })
    }
  })
}

module.exports = { login, signup, validateToken }
