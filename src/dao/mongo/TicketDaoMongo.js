const TicketModel = require("../models/ticket.model");

// DAO de Tickets (comprobantes de compra) con persistencia en MongoDB
class TicketDaoMongo {
  async createTicket(ticketData) {
    const created = await TicketModel.create(ticketData);
    return created.toObject();
  }

  async getTicketById(id) {
    return await TicketModel.findById(id).lean();
  }

  async getTicketByCode(code) {
    return await TicketModel.findOne({ code }).lean();
  }
}

module.exports = TicketDaoMongo;
