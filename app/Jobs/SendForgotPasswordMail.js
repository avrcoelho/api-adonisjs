'use strict'

const Mail = use('Mail')

class SendForgotPasswordMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'SendForgotPasswordMail-job'
  }

  // This is where the work is done.
  async handle ({ username, token, email }) {
    await Mail.send(
      ['emails.forgot_password'],
      {
        username,
        email,
        token
      },
      message => {
        message
          .to(email)
          .from('andrevrcoelho', 'André Coelho')
          .subject('E-mail de recuperação de senha')
      }
    )
  }
}

module.exports = SendForgotPasswordMail
