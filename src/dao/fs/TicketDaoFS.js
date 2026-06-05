const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const dataPath = path.join(__dirname, "..", "..", "data", "tickets.json");

// DAO de Tickets con persistencia en FileSystem (JSON)
class TicketDaoFS {
  constructor() {
    this.path = dataPath;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data || "[]");
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async #writeFile(tickets) {
    await fs.writeFile(this.path, JSON.stringify(tickets, null, 2), "utf-8");
  }

  async createTicket(ticketData) {
    const tickets = await this.#readFile();
    const newTicket = { id: crypto.randomUUID(), ...ticketData };
    tickets.push(newTicket);
    await this.#writeFile(tickets);
    return newTicket;
  }

  async getTicketById(id) {
    const tickets = await this.#readFile();
    return tickets.find((t) => t.id === id) || null;
  }

  async getTicketByCode(code) {
    const tickets = await this.#readFile();
    return tickets.find((t) => t.code === code) || null;
  }
}

module.exports = TicketDaoFS;
