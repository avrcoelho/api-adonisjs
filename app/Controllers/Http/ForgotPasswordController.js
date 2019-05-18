'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const { email } = request.only('email')

      // findByOrFail: se não encontrar ele retorna um erro e cai no catch
      const user = await User.findByOrFail('email', email)

      // cria o token para o suuário
      // tamanho de 10
      // hex: string hexa decimal
      user.token = crypto.randomBytes(10).toString('hex')
      // anota o token com a data atual
      user.token_created_at = new Date()

      await user.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'E-mail não encontrado' } })
    }
  }

  async update ({ request, response }) {
    try {
      // all: pega todos os dados da requisição
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)
      // pega a data atual, tira 2 dias e verifica se isso é maior que a data do token

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'Token expirado' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()

      return response
        .status(201)
        .send({ error: { message: 'Senha alterada com sucesso' } })
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao resetar a sua senha' } })
    }
  }
}

module.exports = ForgotPasswordController
