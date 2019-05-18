'use strict'

const moment = require('moment')
const Event = use('App/Models/Event')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request }) {
    const { page, date } = request.get()

    let query = Event.query().with('user')

    if (date) {
      query = query.where('when', 'LIKE', `%${date}%`)
    }

    // query: inicia uma query
    // with: carrega u relacionadomento do model automaticamnte em cada registro do banco
    // fetch: finaliza essa query
    const events = await query.paginate(page)
    // passa o numero da pagina

    // para usar paginaçao troque o fetch() por paginate()

    return events
  }

  /**
   * Render a form to be used for creating a new event.
   * GET events/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, params, response, view }) {}

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {
    const data = request.only(['when', 'where', 'name'])
    const userId = auth.user.id

    let event = await Event.findBy({ user_id: userId, when: data.when })

    if (event) {
      return response.status(403).send({
        error: { message: 'Já existe um evento nesse mesmo dia e horário' }
      })
    }

    event = await Event.create({ ...data, user_id: userId })

    return event
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response, auth }) {
    try {
      const event = await Event.findOrFail(params.id)

      if (event.user_id !== auth.user.id) {
        return response.status(401).send({
          error: {
            message: 'Apenas o criador do evento pode vê-lo.'
          }
        })
      }

      return event
    } catch (err) {
      return response
        .status(err.status)
        .send({ message: { error: 'Evento não encontrado' } })
    }
  }

  /**
   * Render a form to update an existing event.
   * GET events/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {}

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, auth, request, response }) {
    const { id } = params

    const event = await Event.findOrFail(id)

    if (event.user_id !== auth.user.id) {
      return response.status(403).send({ message: { error: 'Sem permissão' } })
    }

    const passed = moment().isAfter(event.when)

    if (passed) {
      return response.status(401).send({
        error: {
          message: 'Você não pode editar eventos passados.'
        }
      })
    }

    const data = request.only(['name', 'where', 'when'])

    try {
      const eventCompare = await Event.findByOrFail('when', data.when)
      if (eventCompare.id !== Number(params.id)) {
        return response.status(401).send({
          error: {
            message: 'Não é possível definir dois eventos no mesmo horário.'
          }
        })
      }
    } catch (err) {}

    event.merge(data)

    await event.save()

    return event
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, auth, response }) {
    try {
      const { id } = params

      const event = await Event.findOrFail(id)

      if (event.user_id !== auth.user.id) {
        return response
          .status(403)
          .send({ message: { error: 'Sem permissão' } })
      }

      const passed = moment().isAfter(event.when)

      if (passed) {
        return response.status(401).send({
          error: {
            message: 'Você não pode excluir eventos passados.'
          }
        })
      }

      await event.delete()
    } catch (err) {
      return response
        .status(err.status)
        .send({ message: { error: 'Evento não encontrado' } })
    }
  }
}

module.exports = EventController
