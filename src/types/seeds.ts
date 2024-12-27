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

export const quizSeed = [
  {
    title: 'Italian Cuisine Quiz',
    difficultyLevel: 'easy',
    timeLimit: 10,
    status: 'not-started',
    menuName: menusSeed[0].name,
  },
  {
    title: 'Mexican Cuisine Quiz',
    difficultyLevel: 'medium',
    timeLimit: 15,
    status: 'in-progress',
    menuName: menusSeed[0].name,
  },
  {
    title: 'Vegetarian Menu Quiz',
    difficultyLevel: 'hard',
    timeLimit: 20,
    status: 'not-started',
    menuName: menusSeed[1].name,
  },
  {
    title: 'Desserts Quiz',
    difficultyLevel: 'medium',
    timeLimit: 25,
    status: 'completed',
    menuName: menusSeed[1].name,
  },
  {
    title: 'Grilled Dishes Quiz',
    difficultyLevel: 'hard',
    timeLimit: 20,
    status: 'not-started',
    menuName: menusSeed[2].name,
  },
  {
    title: 'Beverages Quiz',
    difficultyLevel: 'easy',
    timeLimit: 15,
    status: 'completed',
    menuName: menusSeed[2].name,
  },
  {
    title: 'Seafood Menu Quiz',
    difficultyLevel: 'medium',
    timeLimit: 30,
    status: 'in-progress',
    menuName: menusSeed[3].name,
  },
  {
    title: 'Vegan Menu Quiz',
    difficultyLevel: 'easy',
    timeLimit: 15,
    status: 'not-started',
    menuName: menusSeed[3].name,
  },
];

export const questionsSeed = [
  {
    text: 'Which of the following are Italian pasta dishes?',
    variants: ['Spaghetti', 'Tacos', 'Lasagna', 'Burgers'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[0].title,
  },
  {
    text: 'Which of these ingredients are essential for making pizza?',
    variants: ['Tomato sauce', 'Mushrooms', 'Chocolate', 'Mozzarella cheese'],
    correct: [0, 3],
    multipleCorrect: true,
    quizTitle: quizSeed[0].title,
  },
  {
    text: 'Which of the following are popular Mexican dishes?',
    variants: ['Tacos', 'Pasta', 'Guacamole', 'Sushi'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[1].title,
  },
  {
    text: 'What are the main ingredients in a Mexican burrito?',
    variants: ['Tortilla', 'Rice', 'Potatoes', 'Ground beef'],
    correct: [0, 1, 3],
    multipleCorrect: true,
    quizTitle: quizSeed[1].title,
  },
  {
    text: 'Which of the following are considered vegetarian dishes?',
    variants: [
      'Veggie Burger',
      'Chicken Salad',
      'Tofu Stir-fry',
      'Beef Burritos',
    ],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[2].title,
  },
  {
    text: 'What are common substitutes for meat in vegetarian meals?',
    variants: ['Tofu', 'Chicken', 'Seitan', 'Fish'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[2].title,
  },
  {
    text: 'Which dishes are commonly served as desserts?',
    variants: ['Chocolate cake', 'Pizza', 'Ice cream', 'Burger'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[3].title,
  },
  {
    text: 'Which of the following ingredients are used in a fruit salad?',
    variants: ['Strawberries', 'Mushrooms', 'Pineapple', 'Sausage'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[3].title,
  },
  {
    text: 'Which beverages are typically non-alcoholic?',
    variants: ['Lemonade', 'Vodka', 'Coffee', 'Beer'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[4].title,
  },
  {
    text: 'Which drinks are commonly served hot?',
    variants: ['Tea', 'Orange juice', 'Coffee', 'Milkshake'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[4].title,
  },
  {
    text: 'Which seafood dishes are popular?',
    variants: [
      'Shrimp cocktail',
      'Fish and chips',
      'Fried chicken',
      'Grilled salmon',
    ],
    correct: [0, 1, 3],
    multipleCorrect: true,
    quizTitle: quizSeed[5].title,
  },
  {
    text: 'Which of these are types of fish commonly used in sushi?',
    variants: ['Salmon', 'Tuna', 'Chicken', 'Tilapia'],
    correct: [0, 1, 3],
    multipleCorrect: true,
    quizTitle: quizSeed[5].title,
  },
  {
    text: 'Which of the following are vegan-friendly ingredients?',
    variants: ['Tofu', 'Chicken', 'Almond milk', 'Honey'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[6].title,
  },
  {
    text: 'Which dishes are typically served in a vegan diet?',
    variants: ['Vegan burgers', 'Egg salad', 'Lentil stew', 'Cheese pizza'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[6].title,
  },
  {
    text: 'Which of these dishes are typically grilled?',
    variants: ['Grilled chicken', 'Sushi', 'Grilled vegetables', 'Spaghetti'],
    correct: [0, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[7].title,
  },
  {
    text: 'What are common side dishes served with grilled meats?',
    variants: ['French fries', 'Mashed potatoes', 'Salad', 'Pasta'],
    correct: [0, 1, 2],
    multipleCorrect: true,
    quizTitle: quizSeed[7].title,
  },
];

export const quizResultSeed = [
  {
    score: '85',
    quizTitle: quizSeed[1].title,
    username: usersSeed[2].username,
  },
  {
    score: '90',
    quizTitle: quizSeed[4].title,
    username: usersSeed[2].username,
  },
  {
    score: '75',
    quizTitle: quizSeed[1].title,
    username: usersSeed[3].username,
  },
  {
    score: '88',
    quizTitle: quizSeed[4].title,
    username: usersSeed[3].username,
  },
];
