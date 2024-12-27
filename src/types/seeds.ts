export const usersSeed = [
  {
    firstName: 'John',
    lastName: 'Doe',
    username: 'john_doe',
    role: 'owner',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    password: 'SecureP@ssw0rd',
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    role: 'admin',
    email: 'test@gmail.com',
    phoneNumber: '+1234567890',
    password: '12345678',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'jane_smith',
    role: 'waiter',
    email: 'jane.smith@example.com',
    phoneNumber: '+0987654321',
    password: 'P@ssword123',
  },
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    username: 'mike_johnson',
    role: 'waiter',
    email: 'michael.johnson@example.com',
    phoneNumber: '+1122334455',
    password: 'Waiter!2345',
  },
];

export const menuItemsSeed = [
  {
    name: 'Margherita Pizza',
    description:
      'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil.',
    ingredients: 'Tomato sauce, mozzarella cheese, basil, olive oil',
    timeForCook: '15 minutes',
    price: 12.99,
  },
  {
    name: 'Caesar Salad',
    description:
      'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan cheese.',
    ingredients: 'Romaine lettuce, Caesar dressing, croutons, parmesan cheese',
    timeForCook: '10 minutes',
    price: 8.99,
  },
  {
    name: 'Spaghetti Carbonara',
    description:
      'Traditional Italian pasta with eggs, pecorino cheese, pancetta, and black pepper.',
    ingredients: 'Spaghetti, eggs, pecorino cheese, pancetta, black pepper',
    timeForCook: '20 minutes',
    price: 13.49,
  },
  {
    name: 'Grilled Salmon',
    description:
      'Fresh salmon fillet grilled to perfection with a side of vegetables.',
    ingredients: 'Salmon fillet, lemon, olive oil, mixed vegetables',
    timeForCook: '25 minutes',
    price: 19.99,
  },
  {
    name: 'Tom Yum Soup',
    description: 'Spicy Thai soup with shrimp, lemongrass, and coconut milk.',
    ingredients: 'Shrimp, lemongrass, coconut milk, chili, lime juice',
    timeForCook: '15 minutes',
    price: 9.99,
  },
  {
    name: 'BBQ Ribs',
    description:
      'Slow-cooked pork ribs with a smoky BBQ glaze, served with fries.',
    ingredients: 'Pork ribs, BBQ sauce, fries, spices',
    timeForCook: '40 minutes',
    price: 18.49,
  },
  {
    name: 'Greek Yogurt Parfait',
    description:
      'Layers of creamy Greek yogurt, honey, granola, and fresh berries.',
    ingredients: 'Greek yogurt, honey, granola, strawberries, blueberries',
    timeForCook: '5 minutes',
    price: 5.99,
  },
  {
    name: 'Beef Tacos',
    description:
      'Soft tortillas filled with seasoned beef, fresh salsa, and cheese.',
    ingredients: 'Ground beef, tortillas, salsa, cheese, lettuce',
    timeForCook: '15 minutes',
    price: 10.99,
  },
];

export const menusSeed = [
  {
    name: 'Spring Delights',
    season: 'spring',
    categories: 'appetizers',
    menuItemNames: [menuItemsSeed[0].name, menuItemsSeed[1].name],
  },
  {
    name: 'Summer Feast',
    season: 'summer',
    categories: 'main courses',
    menuItemNames: [menuItemsSeed[2].name, menuItemsSeed[3].name],
  },
  {
    name: 'Autumn Sweets',
    season: 'fall',
    categories: 'desserts',
    menuItemNames: [menuItemsSeed[4].name, menuItemsSeed[5].name],
  },
  {
    name: 'Winter Comforts',
    season: 'winter',
    categories: 'main courses',
    menuItemNames: [menuItemsSeed[7].name, menuItemsSeed[6].name],
  },
];

export const restaurantsSeed = [
  {
    name: 'Ocean View Restaurant',
    address: '123 Beachside Blvd, Miami, FL',
    ownerUsername: usersSeed[0].username,
    waiterUsername: [usersSeed[2].username],
    menuNames: [menusSeed[2].name, menusSeed[3].name],
  },
  {
    name: 'Mountain Retreat Cafe',
    address: '456 Alpine Road, Denver, CO',
    ownerUsername: usersSeed[0].username,
    waiterUsername: [usersSeed[3].username],
    menuNames: [menusSeed[0].name, menusSeed[1].name],
  },
];
