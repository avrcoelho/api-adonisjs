'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Event extends Model {
  static get dates () {
    return super.dates.concat(['when'])
  }

  user () {
    // pode ter muito porjetos
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Event
