export interface MenuItem {
  name: string;
  description: string;
  price: number;
}

export interface MenuCategory {
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuData {
  categories: MenuCategory[];
}

export const menuData: MenuData = {
  categories: [
    {
      name: 'Appetizers',
      description: 'Start your meal with our delicious starters',
      items: [
        {
          name: 'Spring Rolls',
          description: 'Crispy vegetable spring rolls served with sweet chili sauce',
          price: 6.95,
        },
        {
          name: 'Pork Dumplings',
          description: 'Pan-fried or steamed dumplings filled with seasoned pork',
          price: 8.95,
        },
        {
          name: 'Scallion Pancakes',
          description: 'Flaky, savory pancakes with fresh scallions',
          price: 7.50,
        },
        {
          name: 'Hot & Sour Soup',
          description: 'Traditional spicy and tangy soup with tofu and mushrooms',
          price: 5.95,
        },
      ],
    },
    {
      name: 'Noodles',
      description: 'Hand-pulled and freshly prepared',
      items: [
        {
          name: 'Dan Dan Noodles',
          description: 'Spicy Sichuan noodles with minced pork and peanut sauce',
          price: 13.95,
        },
        {
          name: 'Beef Chow Mein',
          description: 'Stir-fried noodles with tender beef and crisp vegetables',
          price: 14.95,
        },
        {
          name: 'Singapore Noodles',
          description: 'Curry-flavored rice noodles with shrimp and vegetables',
          price: 15.95,
        },
        {
          name: 'Lo Mein',
          description: 'Soft egg noodles with your choice of chicken, beef, or vegetables',
          price: 12.95,
        },
      ],
    },
    {
      name: 'Rice Dishes',
      description: 'Served with steamed jasmine rice',
      items: [
        {
          name: 'Yangzhou Fried Rice',
          description: 'Classic fried rice with shrimp, BBQ pork, and vegetables',
          price: 13.95,
        },
        {
          name: 'Mapo Tofu',
          description: 'Spicy Sichuan tofu with minced pork in chili bean sauce',
          price: 12.95,
        },
        {
          name: 'Kung Pao Chicken',
          description: 'Stir-fried chicken with peanuts, vegetables, and chili peppers',
          price: 14.95,
        },
        {
          name: 'Sweet & Sour Pork',
          description: 'Crispy pork with bell peppers in tangy sweet and sour sauce',
          price: 13.95,
        },
      ],
    },
    {
      name: "Chef's Specials",
      description: 'Signature dishes crafted by our master chefs',
      items: [
        {
          name: 'Peking Duck',
          description: 'Crispy roasted duck served with pancakes, scallions, and hoisin sauce',
          price: 28.95,
        },
        {
          name: 'Braised Pork Belly',
          description: 'Tender pork belly slow-cooked in aromatic spices',
          price: 18.95,
        },
        {
          name: 'Whole Steamed Fish',
          description: 'Fresh fish steamed with ginger, scallions, and soy sauce',
          price: 24.95,
        },
        {
          name: 'Szechuan Hot Pot',
          description: 'Spicy broth with assorted meats, seafood, and vegetables (serves 2)',
          price: 38.95,
        },
      ],
    },
    {
      name: 'Drinks',
      description: 'Refresh your palate',
      items: [
        {
          name: 'Jasmine Tea',
          description: 'Traditional hot or iced jasmine tea',
          price: 3.50,
        },
        {
          name: 'Bubble Tea',
          description: 'Choice of milk tea or fruit tea with tapioca pearls',
          price: 5.95,
        },
        {
          name: 'Plum Wine',
          description: 'Sweet Japanese plum wine',
          price: 7.95,
        },
        {
          name: 'Soft Drinks',
          description: 'Coke, Sprite, or ginger ale',
          price: 2.95,
        },
      ],
    },
  ],
};
