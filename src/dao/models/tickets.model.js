const mongoose = require("mongoose");

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datatime: {
    type: String,
  },
  amount: {
    type: Number,
  },
  purchaser: {
    type: String,
  },
  products: {
    type: [
      {
        title: String,
        quantity: Number,
      },
    ],
    default: [],
  },
});

const ticketsModel = mongoose.model(ticketsCollection, ticketSchema);

module.exports = ticketsModel;
