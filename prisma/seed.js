const prisma = require("../prisma");
const seed = async () => {
  // TODO: Create Customers, Restaurants and Reservations

  // Create Customers
  const createCustomers = async () => {
    const customers = [
      { name: "Alice Johnson" },
      { name: "Bob Smith" },
      { name: "Charlie Brown" },
      { name: "Diana Prince" },
    ];
    await prisma.customer.createMany({ data: customers });
    console.log("Customers seeded!");
  };

  // Create Restaurants
  const createRestaurants = async () => {
    const restaurants = [
      { name: "Pizza Palace" },
      { name: "Burger Barn" },
      { name: "Sushi Spot" },
    ];
    await prisma.restaurant.createMany({ data: restaurants });
    console.log("Restaurants seeded!");
  };

  // Create Reservations
  const createReservations = async () => {
    // Fetch Customer and Restaurant IDs
    const customers = await prisma.customer.findMany();
    const restaurants = await prisma.restaurant.findMany();

    const reservations = [
      {
        customerId: customers[0].id,
        restaurantId: restaurants[0].id,
        partyCount: 4,
        date: new Date("2024-06-20T18:30:00Z"),
      },
      {
        customerId: customers[1].id,
        restaurantId: restaurants[1].id,
        partyCount: 2,
        date: new Date("2024-06-21T12:00:00Z"),
      },
      {
        customerId: customers[2].id,
        restaurantId: restaurants[2].id,
        partyCount: 6,
        date: new Date("2024-06-22T19:00:00Z"),
      },
    ];

    await prisma.reservation.createMany({ data: reservations });
    console.log("Reservations seeded!");
  };

  // Sequentially Run Seed Functions
  await createCustomers();
  await createRestaurants();
  await createReservations();
};

seed()
  .then(async () => {
    console.log("Database successfully seeded.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
