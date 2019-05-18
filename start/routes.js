'use strict'

const Route = use('Route')

Route.post('/users', 'UserController.store').validator('User')

Route.post('/sessions', 'SessionController.store').validator('Session')

Route.post('/passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)

Route.put('/passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

// esse grupo de rotas só vai poder ser acessado com o usuario autenticado
Route.group(() => {
  Route.resource('/events', 'EventController')
    .apiOnly()
    .validator(new Map([[['events.store'], ['Event']]]))
}).middleware(['auth'])
