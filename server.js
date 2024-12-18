const express = require("express");
const app = express();
const PORT = 3000;

const prisma = require("./prisma");

// Middleware
app.use(express.json());
app.use(require("morgan")("dev"));

// Routes
/** GET /api/customers - returns an array of customers */
app.get("/api/customers", async (req, res, next) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

/** GET /api/restaurants - returns an array of restaurants */
app.get("/api/restaurants", async (req, res, next) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
});

/** GET /api/reservations - returns an array of reservations */

app.get("/api/reservations", async (req, res, next) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { customer: true, restaurant: true }, // Optional: include relations
    });
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/customers/:id/reservations
 * Creates a reservation for a customer with the given ID
 */

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    const { id } = req.params; // Customer ID
    const { restaurantId, date, partyCount } = req.body;

    const newReservation = await prisma.reservation.create({
      data: {
        date: new Date(date),
        partyCount: parseInt(partyCount),
        customer: { connect: { id: parseInt(id) } },
        restaurant: { connect: { id: parseInt(restaurantId) } },
      },
    });

    res.status(201).json(newReservation);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/customers/:customerId/reservations/:id
 * Deletes a reservation with the given ID for a specific customer
 */
app.delete(
  "/api/customers/:customerId/reservations/:id",
  async (req, res, next) => {
    try {
      const { id, customerId } = req.params;

      // Optionally ensure the reservation belongs to the specified customer
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(id) },
      });

      if (!reservation || reservation.customerId !== parseInt(customerId)) {
        return res
          .status(404)
          .json({ message: "Reservation not found for this customer" });
      }

      // Delete the reservation
      await prisma.reservation.delete({
        where: { id: parseInt(id) },
      });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// Simple error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error.";
  res.status(status).json({ message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
