import { DifficultyLevelEnum, StatusEnum } from 'src/quiz/dto/create-quiz.dto';

export const usersSeed = [
  {
    firstName: 'Mriia',
    lastName: 'Petrenko',
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
    firstName: 'Arthur',
    lastName: 'Morgan',
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
    waiterUsername: [usersSeed[2].username],
  },
  {
    name: 'Mountain Retreat Cafe',
    address: '456 Alpine Road, Denver, CO',
    ownerUsername: usersSeed[0].username,
    waiterUsername: [usersSeed[3].username],
  },
];

export const quizSeed = [
  {
    title: 'Italian Cuisine Quiz',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 10,
    status: StatusEnum.IN_PROGRESS,
  },
  {
    title: 'Mexican Cuisine Quiz',
    difficultyLevel: DifficultyLevelEnum.MEDIUM,
    timeLimit: 15,
    status: StatusEnum.IN_PROGRESS,
  },
  {
    title: 'Vegetarian Menu Quiz',
    difficultyLevel: DifficultyLevelEnum.HARD,
    timeLimit: 20,
    status: StatusEnum.NOT_STARTED,
  },
  {
    title: 'Desserts Quiz',
    difficultyLevel: DifficultyLevelEnum.MEDIUM,
    timeLimit: 25,
    status: StatusEnum.COMPLETED,
  },
  {
    title: 'Grilled Dishes Quiz',
    difficultyLevel: DifficultyLevelEnum.HARD,
    timeLimit: 20,
    status: StatusEnum.NOT_STARTED,
  },
  {
    title: 'Beverages Quiz',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 15,
    status: StatusEnum.COMPLETED,
  },
  {
    title: 'Seafood Menu Quiz',
    difficultyLevel: DifficultyLevelEnum.MEDIUM,
    timeLimit: 30,
    status: StatusEnum.IN_PROGRESS,
  },
  {
    title: 'Vegan Menu Quiz',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 15,
    status: StatusEnum.NOT_STARTED,
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
