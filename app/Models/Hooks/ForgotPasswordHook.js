'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/SendForgotPasswordMail')

const ForgotPasswordHook = (exports = module.exports = {})

ForgotPasswordHook.sendForgotPasswordMail = async passInstance => {
  // verifica se a task tem o campo user_id e se ela foi editada recetimente
  // se tiver o user_id no dirty é porque ele foi editado recentimente
  if (!passInstance.id && passInstance.dirty.token) {
    return false
  }

  const { email, username, token } = passInstance

  // attempts: tente reenviar 3 vezes caso ele não consiga
  Kue.dispatch(Job.key, { email, username, token }, { attempts: 3 })
}
