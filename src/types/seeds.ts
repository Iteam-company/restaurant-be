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

export const restaurantsSeed = [
  {
    name: 'Ocean View Restaurant',
    address: '123 Beachside Blvd, Miami, FL',
    ownerUsername: usersSeed[0].username,
  },
  {
    name: 'Mountain Retreat Cafe',
    address: '456 Alpine Road, Denver, CO',
    ownerUsername: usersSeed[0].username,
  },
];
