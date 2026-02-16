export interface PriceVariant {
  label: string;
  price: number;
}

export interface MenuItem {
  name: string;
  description: string;
  price?: number; // single price (backward compatible)
  variants?: PriceVariant[]; // multiple price options
  image?: string;
}

export interface MenuCategory {
  name: string;
  description?: string;
  thumbnail: string;
  items: MenuItem[];
}

export interface MenuData {
  categories: MenuCategory[];
}

export const menuData: MenuData = {
  categories: [
    {
      name: 'Appetizers',
      thumbnail: '/assets/generated/menu-cat-starters.dim_256x256.png',
      description: 'Start your meal with our delicious appetizers',
      items: [
        {
          name: 'Chicken Drum Sticks',
          description: 'Crispy fried chicken drum sticks',
          variants: [
            { label: '2pcs', price: 450 },
            { label: '4pcs', price: 800 },
          ],
        },
        {
          name: 'Chicken Dumplings (steam/fried)',
          description: 'Steamed or fried chicken dumplings',
          variants: [
            { label: '5pcs', price: 575 },
            { label: '10pcs', price: 995 },
          ],
        },
        {
          name: 'Tempura Jumbo Prawns',
          description: 'Crispy tempura battered jumbo prawns',
          variants: [
            { label: '2pcs', price: 800 },
            { label: 'Full', price: 1399 },
          ],
        },
        {
          name: 'Fried Finger Fish',
          description: 'Crispy fried fish fingers',
          variants: [{ label: '6pcs', price: 995 }],
        },
        {
          name: 'Dynamite Chicken',
          description: 'Spicy dynamite chicken',
          price: 850,
        },
        {
          name: 'Dynamite Prawns',
          description: 'Spicy dynamite prawns',
          price: 1050,
        },
        {
          name: 'Honey Glazed Wings',
          description: 'Sweet honey glazed chicken wings',
          variants: [{ label: '6pcs', price: 695 }],
        },
        {
          name: 'Spicy Chilli Wings',
          description: 'Spicy chilli chicken wings',
          variants: [{ label: '6pcs', price: 695 }],
        },
        {
          name: 'Fish & Chips',
          description: 'Crispy fish with chips',
          variants: [{ label: '3pcs', price: 1300 }],
        },
        {
          name: 'Fries / Masala / Plain',
          description: 'French fries with masala or plain',
          price: 300,
        },
        {
          name: 'Fish Crackers',
          description: 'Crispy fish crackers',
          price: 270,
        },
        {
          name: 'Garlic Mayo Fries',
          description: 'Fries with garlic mayo',
          price: 370,
        },
      ],
    },
    {
      name: 'Soup',
      thumbnail: '/assets/generated/menu-cat-soups.dim_256x256.png',
      description: 'Warm and comforting soups',
      items: [
        {
          name: 'Second Bowl Special Soup',
          description: 'Our signature special soup',
          variants: [
            { label: 'Single', price: 565 },
            { label: 'Family', price: 1095 },
          ],
        },
        {
          name: 'Prawn Soup',
          description: 'Fresh prawn soup',
          variants: [
            { label: 'Single', price: 500 },
            { label: 'Family', price: 1500 },
          ],
        },
        {
          name: 'Hot & Sour Soup',
          description: 'Spicy and tangy hot & sour soup',
          variants: [
            { label: 'Single', price: 295 },
            { label: 'Family', price: 855 },
          ],
        },
        {
          name: 'Chicken Corn Soup',
          description: 'Creamy chicken corn soup',
          variants: [
            { label: 'Single', price: 295 },
            { label: 'Family', price: 855 },
          ],
        },
        {
          name: 'Szechuan Soup',
          description: 'Spicy Szechuan style soup',
          variants: [
            { label: 'Single', price: 500 },
            { label: 'Family', price: 1200 },
          ],
        },
        {
          name: 'Thai Clear Soup',
          description: 'Light and refreshing Thai clear soup',
          variants: [
            { label: 'Single', price: 295 },
            { label: 'Family', price: 855 },
          ],
        },
        {
          name: 'Thai Chicken Noodle Soup',
          description: 'Thai style chicken noodle soup',
          variants: [
            { label: 'Single', price: 295 },
            { label: 'Family', price: 855 },
          ],
        },
      ],
    },
    {
      name: 'Poultry',
      thumbnail: '/assets/generated/menu-cat-chicken-entrees.dim_256x256.png',
      description: 'All Platters will be served with any Option Egg Fried Rice, Vegetable Rice Or Masala Rice',
      items: [
        {
          name: 'Second Bowl Special Chicken',
          description: 'Our signature special chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Black Paper Chicken',
          description: 'Spicy black pepper chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Chicken Cashewnut',
          description: 'Chicken with cashew nuts',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Kung Pao Chicken',
          description: 'Classic Kung Pao chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Szechuan Chicken',
          description: 'Spicy Szechuan chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Garlic Chicken',
          description: 'Garlic flavored chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Mongolian Chicken',
          description: 'Mongolian style chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Hot Garlic Chicken',
          description: 'Spicy hot garlic chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Chicken Chilli Dry',
          description: 'Dry chilli chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Home Made Chilli Dry',
          description: 'Home style chilli dry',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Chicken Manchurian',
          description: 'Chicken Manchurian',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Chicken Shashlik',
          description: 'Chicken shashlik',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Sweet & Sour Chicken',
          description: 'Sweet and sour chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Crispy Chilli Chicken',
          description: 'Crispy chilli chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
        {
          name: 'Crispy Honey Chicken',
          description: 'Crispy honey chicken',
          variants: [
            { label: 'Platters', price: 795 },
            { label: 'Full (Only Gravy)', price: 875 },
          ],
        },
      ],
    },
    {
      name: 'Beef',
      thumbnail: '/assets/generated/menu-cat-rice-noodles.dim_256x256.png',
      description: 'All Platters will be served with any Option Egg Fried Rice, Vegetable Rice Or Masala Rice',
      items: [
        {
          name: 'Second Bowl Special Beef',
          description: 'Our signature special beef',
          variants: [
            { label: 'Platters', price: 975 },
            { label: 'Full (Only Gravy)', price: 995 },
          ],
        },
        {
          name: 'Beef Chilli Dry',
          description: 'Dry chilli beef',
          variants: [
            { label: 'Platters', price: 975 },
            { label: 'Full (Only Gravy)', price: 995 },
          ],
        },
        {
          name: 'Mongolian Beef',
          description: 'Mongolian style beef',
          variants: [
            { label: 'Platters', price: 975 },
            { label: 'Full (Only Gravy)', price: 995 },
          ],
        },
        {
          name: 'Black Papper Beef',
          description: 'Spicy black pepper beef',
          variants: [
            { label: 'Platters', price: 975 },
            { label: 'Full (Only Gravy)', price: 995 },
          ],
        },
        {
          name: 'Crispy Honey Beef',
          description: 'Crispy honey beef',
          variants: [
            { label: 'Platters', price: 975 },
            { label: 'Full (Only Gravy)', price: 995 },
          ],
        },
        {
          name: 'Beef Szechuan',
          description: 'Spicy Szechuan beef',
          variants: [
            { label: 'Platters', price: 975 },
            { label: 'Full (Only Gravy)', price: 995 },
          ],
        },
        {
          name: 'Beef Osyter',
          description: 'Beef in oyster sauce',
          variants: [
            { label: 'Platters', price: 975 },
            { label: 'Full (Only Gravy)', price: 995 },
          ],
        },
      ],
    },
    {
      name: 'Prawns',
      thumbnail: '/assets/generated/menu-cat-create-bowl.dim_256x256.png',
      description: 'All Platters will be served with any Option Egg Fried Rice, Vegetable Rice Or Masala Rice',
      items: [
        {
          name: 'Second Bowl Special Prawn',
          description: 'Our signature special prawn',
          variants: [
            { label: 'Platters', price: 995 },
            { label: 'Full (Only Gravy)', price: 1195 },
          ],
        },
        {
          name: 'Szechuan Prawn',
          description: 'Spicy Szechuan prawn',
          variants: [
            { label: 'Platters', price: 995 },
            { label: 'Full (Only Gravy)', price: 1195 },
          ],
        },
        {
          name: 'Sweet & Sour Prawn',
          description: 'Sweet and sour prawn',
          variants: [
            { label: 'Platters', price: 995 },
            { label: 'Full (Only Gravy)', price: 1195 },
          ],
        },
        {
          name: 'Kung Pao Prawn',
          description: 'Classic Kung Pao prawn',
          variants: [
            { label: 'Platters', price: 995 },
            { label: 'Full (Only Gravy)', price: 1195 },
          ],
        },
        {
          name: 'Prawn Cashewnut',
          description: 'Prawn with cashew nuts',
          variants: [
            { label: 'Platters', price: 995 },
            { label: 'Full (Only Gravy)', price: 1195 },
          ],
        },
        {
          name: 'Hot Galic Prawn',
          description: 'Spicy hot garlic prawn',
          variants: [
            { label: 'Platters', price: 995 },
            { label: 'Full (Only Gravy)', price: 1195 },
          ],
        },
        {
          name: 'Prawn Oyster',
          description: 'Prawn in oyster sauce',
          variants: [
            { label: 'Platters', price: 995 },
            { label: 'Full (Only Gravy)', price: 1195 },
          ],
        },
        {
          name: 'Prawn Chilli Dry',
          description: 'Dry chilli prawn',
          variants: [
            { label: 'Platters', price: 1050 },
            { label: 'Full (Only Gravy)', price: 1250 },
          ],
        },
        {
          name: 'Prawn Manchurian',
          description: 'Prawn Manchurian',
          variants: [
            { label: 'Platters', price: 995 },
            { label: 'Full (Only Gravy)', price: 1195 },
          ],
        },
      ],
    },
    {
      name: 'Fish',
      thumbnail: '/assets/generated/menu-cat-starters.dim_256x256.png',
      description: 'All Platters will be served with any Option Egg Fried Rice, Vegetable Rice Or Masala Rice',
      items: [
        {
          name: 'Second Bowl Special Fish',
          description: 'Our signature special fish',
          variants: [
            { label: 'Platters', price: 955 },
            { label: 'Full (Only Gravy)', price: 1145 },
          ],
        },
        {
          name: 'Fish Chilli Dry',
          description: 'Dry chilli fish',
          variants: [
            { label: 'Platters', price: 955 },
            { label: 'Full (Only Gravy)', price: 1145 },
          ],
        },
        {
          name: 'Sweet & Sour Fish',
          description: 'Sweet and sour fish',
          variants: [
            { label: 'Platters', price: 955 },
            { label: 'Full (Only Gravy)', price: 1145 },
          ],
        },
        {
          name: 'Hot Garlic Fish',
          description: 'Spicy hot garlic fish',
          variants: [
            { label: 'Platters', price: 955 },
            { label: 'Full (Only Gravy)', price: 1145 },
          ],
        },
        {
          name: 'Szechuan Fish',
          description: 'Spicy Szechuan fish',
          variants: [
            { label: 'Platters', price: 955 },
            { label: 'Full (Only Gravy)', price: 1145 },
          ],
        },
        {
          name: 'Kung Pao Fish',
          description: 'Classic Kung Pao fish',
          variants: [
            { label: 'Platters', price: 955 },
            { label: 'Full (Only Gravy)', price: 1145 },
          ],
        },
        {
          name: 'Fish Manchurian',
          description: 'Fish Manchurian',
          variants: [
            { label: 'Platters', price: 955 },
            { label: 'Full (Only Gravy)', price: 1145 },
          ],
        },
      ],
    },
    {
      name: 'Thai',
      thumbnail: '/assets/generated/menu-cat-rice-noodles.dim_256x256.png',
      description: 'All Platters will be served with any Option Egg Fried Rice, Vegetable Rice Or Masala Rice',
      items: [
        {
          name: 'Thai Chicken Oyster',
          description: 'Thai style chicken in oyster sauce',
          variants: [
            { label: 'Platters', price: 895 },
            { label: 'Full (Only Gravy)', price: 1095 },
          ],
        },
        {
          name: 'Thai Red Carry Prawn',
          description: 'Thai red curry prawn',
          variants: [
            { label: 'Platters', price: 1045 },
            { label: 'Full (Only Gravy)', price: 1245 },
          ],
        },
        {
          name: 'Thai Green Carry Prawn',
          description: 'Thai green curry prawn',
          variants: [
            { label: 'Platters', price: 1045 },
            { label: 'Full (Only Gravy)', price: 1245 },
          ],
        },
        {
          name: 'Thai Red Carry Chicken',
          description: 'Thai red curry chicken',
          variants: [
            { label: 'Platters', price: 895 },
            { label: 'Full (Only Gravy)', price: 1095 },
          ],
        },
        {
          name: 'Thai Green Carry Chicken',
          description: 'Thai green curry chicken',
          variants: [
            { label: 'Platters', price: 895 },
            { label: 'Full (Only Gravy)', price: 1095 },
          ],
        },
        {
          name: 'Thai Bangkok Chicken',
          description: 'Thai Bangkok style chicken',
          variants: [
            { label: 'Platters', price: 895 },
            { label: 'Full (Only Gravy)', price: 1095 },
          ],
        },
      ],
    },
    {
      name: 'Rices',
      thumbnail: '/assets/generated/menu-cat-rice-noodles.dim_256x256.png',
      description: 'Flavorful rice dishes',
      items: [
        {
          name: 'Second Bowl Special Rice',
          description: 'Our signature special rice',
          price: 1100,
        },
        {
          name: 'Chicken Fried Rice',
          description: 'Fried rice with chicken',
          price: 950,
        },
        {
          name: 'Chicken Masala Rice',
          description: 'Masala rice with chicken',
          price: 950,
        },
        {
          name: 'Egg Fried Rice',
          description: 'Fried rice with scrambled eggs',
          price: 850,
        },
        {
          name: 'Vegetable Rice',
          description: 'Rice with mixed vegetables',
          price: 850,
        },
      ],
    },
    {
      name: 'Noodles',
      thumbnail: '/assets/generated/menu-cat-rice-noodles.dim_256x256.png',
      description: 'Delicious noodle dishes',
      items: [
        {
          name: 'Second Bowl Special Chowmein',
          description: 'Our signature special chowmein',
          price: 1300,
        },
        {
          name: 'Thai Beef Chilli Noodle',
          description: 'Spicy Thai-style beef noodles',
          price: 1250,
        },
        {
          name: 'Thai Chicken Chilli Noodle',
          description: 'Spicy Thai-style chicken noodles',
          price: 1150,
        },
        {
          name: 'Thai Chicken Crispy Chilli Noodle',
          description: 'Crispy spicy Thai-style chicken noodles',
          price: 1250,
        },
        {
          name: 'Chicken Chowmein',
          description: 'Stir-fried noodles with chicken',
          price: 1100,
        },
        {
          name: 'Vegetable Chowmein',
          description: 'Stir-fried noodles with vegetables',
          price: 950,
        },
      ],
    },
    {
      name: 'Cold Drink',
      thumbnail: '/assets/generated/menu-cat-create-bowl.dim_256x256.png',
      description: 'Refreshing beverages',
      items: [
        {
          name: 'Pepsi Can',
          description: 'Chilled Pepsi can',
          price: 190,
        },
        {
          name: 'Mirinda Can',
          description: 'Chilled Mirinda can',
          price: 190,
        },
        {
          name: '7up Can',
          description: 'Chilled 7up can',
          price: 190,
        },
        {
          name: 'Menrial Water Small',
          description: 'Small mineral water bottle',
          price: 120,
        },
        {
          name: 'Next Cola Can',
          description: 'Chilled Next Cola can',
          price: 199,
        },
        {
          name: 'Fresh Lime',
          description: 'Fresh lime juice',
          price: 250,
        },
        {
          name: 'Mint Margarita',
          description: 'Refreshing mint margarita',
          price: 450,
        },
      ],
    },
    {
      name: 'Exclusive Deals',
      thumbnail: '/assets/generated/menu-cat-create-bowl.dim_256x256.png',
      description: 'Special combo deals',
      items: [
        {
          name: 'Deal For 1',
          description: '1x Chicken Platter, 1x Chicken Drum Stick, 1x Cold Drink',
          price: 1300,
        },
        {
          name: 'Deal For 2',
          description: '1x Chicken Full Gravy, 1x Egg Fried Rice, 4x Pcs Dumplings, 2x Cold Drink',
          price: 3000,
        },
        {
          name: 'Deal For 3',
          description: '1x Chicken Full Gravy, 1x Egg Fried Rice, 1x Chicken Chowmein, 6x Pcs Wings, 1x Liter Cold Drink',
          price: 4000,
        },
        {
          name: 'Deal For 4',
          description: '1x Hot & Sour Full, 1x Fish Cracker, 4x Pcs Dumpling, 1x Chicken Gravy, 1x Chicken Chowmein, 1x Egg Fried Rice, 1x Liter Cold Drink',
          price: 5000,
        },
      ],
    },
  ],
};
