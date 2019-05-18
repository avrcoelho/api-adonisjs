'use strict'

const Antl = use('Antl')

class ResetPassword {
  // isso vai fazer com que todos os campos sejam validados de uma vez
  get validateAll () {
    return true
  }

  get rules () {
    return {
      password: 'required|confirmed',
      token: 'required'
    }
  }

  // como as mensagens devem ser retronadas
  get messages () {
    // passa o nome do arquivo criado no resources locals
    return Antl.list('validation')
  }
}

module.exports = ResetPassword
