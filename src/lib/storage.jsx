// localStorage utility functions

const KEYS = {
    USERS: 'canteen_users',
    MENU: 'canteen_menu',
    ORDERS: 'canteen_orders',
    SLOTS: 'canteen_slots',
    AUTH: 'canteen_auth',
    CART: 'canteen_cart',
    THEME: 'canteen_theme',
    COLOR_THEME: 'canteen_color_theme',
    WALLET: 'canteen_wallet',
    NOTIFICATIONS: 'canteen_notifications',
    COUPONS: 'canteen_coupons',
    REVIEWS: 'canteen_reviews',
    KILL_SWITCH: 'canteen_kill_switch',
    EMERGENCY_NOTICE: 'canteen_emergency_notice',
    KITCHEN_QUEUE: 'canteen_kitchen_queue',
    TOKEN_COUNTER: 'canteen_token_counter',
    STREAKS: 'canteen_streaks',
    USER_PREFERENCES: 'canteen_user_preferences',
    DAILY_STATS: 'canteen_daily_stats',
    ORDER_TIMERS: 'canteen_order_timers',
};

export function getItem(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Get device info string
export function getDeviceInfo() {
    const ua = navigator.userAgent;
    let browser = 'Browser';
    let os = 'Unknown OS';
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'Mac';
    else if (ua.includes('iPhone')) os = 'iPhone';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('Linux')) os = 'Linux';
    return `${browser} | ${os}`;
}

function getMenuImage(name) {
    return `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(name)}`;
}

const EXPANDED_MENU = [
    // Breakfast
    { id: 'm1', name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato filling, sambar & chutney', price: 60, category: 'breakfast', image: 'https://thumbs.dreamstime.com/b/delicious-masala-dosa-south-indian-cuisine-crispy-crepe-filled-potato-filling-served-sambar-coconut-chutney-specialty-367699771.jpg', isVeg: true, available: true, prepTime: 8, complexity: 2, rating: 4.5, ratingCount: 120, tags: ['spicy', 'crispy'] },
    { id: 'm2', name: 'Idli (2 pcs)', description: 'Soft steamed rice cakes with sambar & coconut chutney', price: 40, category: 'breakfast', image: 'https://img.freepik.com/premium-photo/idli-idly-is-healthy-indian-vegetarian-traditional-popular-steam-cooked-rice-cakes-served-with-bowls-chutney-sambar-as-side-dishesselective-focus_726363-403.jpg', isVeg: true, available: true, prepTime: 5, complexity: 1, rating: 4.3, ratingCount: 95, tags: ['healthy', 'light'] },
    { id: 'm3', name: 'Vada', description: 'Crispy lentil donut with sambar & chutney', price: 35, category: 'breakfast', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTql6EwPMQHtdugOVYk8urIGDCopMfeXePc_w&s', isVeg: true, available: true, prepTime: 4, complexity: 1, rating: 4.2, ratingCount: 88, tags: ['crispy', 'quick'] },
    { id: 'm4', name: 'Poori Bhaji', description: '2 pooris with spiced potato curry', price: 70, category: 'breakfast', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4oaqcN6UgWeVL2l_7n7BfW_dA7OEkht2y9w&s', isVeg: true, available: true, prepTime: 10, complexity: 2, rating: 4.4, ratingCount: 105, tags: ['filling', 'popular'] },
    { id: 'm5b', name: 'Pongal', description: 'Comforting rice lentil porridge with ghee', price: 55, category: 'breakfast', image: 'https://i0.wp.com/spicechronicles.com/wp-content/uploads/2018/04/Pongal_2.jpg?resize=640%2C640&ssl=1', isVeg: true, available: true, prepTime: 7, complexity: 1, rating: 4.1, ratingCount: 72, tags: ['healthy', 'light'] },
    { id: 'm6b', name: 'Uttapam', description: 'Thick rice pancake with onions, tomatoes & chillies', price: 65, category: 'breakfast', image: 'https://spiceyandsugarybites.wordpress.com/wp-content/uploads/2016/08/uttapam.jpg?w=598', isVeg: true, available: true, prepTime: 9, complexity: 2, rating: 4.2, ratingCount: 80, tags: ['crispy', 'popular'] },
    { id: 'm7b', name: 'Chapati (2 pcs)', description: 'Soft whole wheat flatbread with butter', price: 45, category: 'breakfast', image:'https://pipingpotcurry.com/wp-content/uploads/2019/01/Roti-Chapati-Whole-Wheat-Indian-Flatbread-5.jpg', isVeg: true, available: true, prepTime: 6, complexity: 1, rating: 4.0, ratingCount: 65, tags: ['light', 'healthy'] },
    { id: 'm8b', name: 'Egg Burji', description: 'Fluffy scrambled eggs with spices & veggies', price: 50, category: 'breakfast', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmUkF6kLcpxLMvW3KBcuIu-BIDXueBlA14mw&s', isVeg: false, available: true, prepTime: 5, complexity: 1, rating: 4.3, ratingCount: 110, tags: ['protein', 'quick'] },
    { id: 'm16', name: 'Masala Chai', description: 'Spiced Indian tea with milk & ginger', price: 15, category: 'breakfast', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4H1DOWvhTwU7ZrxuUFQ1GHwn-TPhf2K9dRg&s', isVeg: true, available: true, prepTime: 3, complexity: 1, rating: 4.9, ratingCount: 420, tags: ['hot', 'popular'] },

    // Lunch
    { id: 'm6', name: 'Chicken Biryani', description: 'Hyderabadi style aromatic basmati rice with tender chicken & raita', price: 220, category: 'lunch', image: 'https://mealpractice.b-cdn.net/37826292875399168/chicken-biryani-with-raita-bnmCU1dFDA.webp', isVeg: false, available: true, prepTime: 15, complexity: 3, rating: 4.8, ratingCount: 310, tags: ['bestseller', 'spicy'] },
    { id: 'm6v', name: 'Veg Biryani', description: 'Aromatic rice with mixed vegetables & mint chutney', price: 160, category: 'lunch', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8r4C0t2vRI66lejbMwyAwIlgvM18eCqKdAg&s', isVeg: true, available: true, prepTime: 12, complexity: 2, rating: 4.5, ratingCount: 180, tags: ['popular', 'value'] },
    { id: 'm6m', name: 'Mutton Biryani', description: 'Rich mutton pieces in fragrant basmati rice', price: 280, category: 'lunch', image: 'https://i.ytimg.com/vi/bGHBp-3OOT4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDMc2WmkrkQrKoii9wtRNJGuxCtIw', isVeg: false, available: true, prepTime: 18, complexity: 3, rating: 4.7, ratingCount: 245, tags: ['premium', 'spicy'] },
    { id: 'm6e', name: 'Egg Biryani', description: 'Flavourful rice with boiled eggs & spices', price: 150, category: 'lunch', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLD0jsO2ZOpcXv_Ajq9rbewkS07xU2RhRjbQ&s', isVeg: false, available: true, prepTime: 10, complexity: 2, rating: 4.4, ratingCount: 155, tags: ['quick', 'popular'] },
    { id: 'm7', name: 'Paneer Butter Masala', description: 'Cottage cheese in rich creamy tomato gravy', price: 180, category: 'lunch', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnBpjixfbeYtDvlx58NrRhZkjw3-YOtmNxOw&s', isVeg: true, available: true, prepTime: 12, complexity: 2, rating: 4.6, ratingCount: 175, tags: ['rich', 'popular'] },
    { id: 'm13', name: 'Butter Chicken', description: 'Classic Punjabi - tender chicken in buttery tomato gravy', price: 200, category: 'lunch', image: 'https://i.ytimg.com/vi/U1ZFK6PQ7CA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBQWEYAbpS8EpbkezSM1S23ruB4Ng', isVeg: false, available: true, prepTime: 14, complexity: 3, rating: 4.8, ratingCount: 350, tags: ['bestseller', 'rich'] },
    { id: 'm14', name: 'Dal Makhani', description: 'Slow cooked black lentils with butter & cream', price: 130, category: 'lunch', image: 'https://i.ytimg.com/vi/BYcgqkT-JbI/maxresdefault.jpg', isVeg: true, available: true, prepTime: 10, complexity: 2, rating: 4.6, ratingCount: 165, tags: ['comfort', 'rich'] },
    { id: 'ml8', name: 'Kadai Paneer', description: 'Cottage cheese in spicy capsicum & onion gravy', price: 170, category: 'lunch', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfXrgLPBqWojhhhd2gYORoo8se4GnJVekB5w&s', isVeg: true, available: true, prepTime: 11, complexity: 2, rating: 4.4, ratingCount: 138, tags: ['spicy', 'popular'] },
    { id: 'ml9', name: 'Chicken 65', description: 'Crispy spicy fried chicken - South Indian style', price: 190, category: 'lunch', image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/chicken-65-restaurant-style.jpg', isVeg: false, available: true, prepTime: 12, complexity: 2, rating: 4.6, ratingCount: 220, tags: ['spicy', 'crispy'] },
    { id: 'ml10', name: 'Fish Curry', description: 'Andhra style spicy fish curry', price: 210, category: 'lunch', image: 'https://i.ytimg.com/vi/CLp4sZsHeLE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD6KOsYsy4wmKgKgF2e4p3wP0T96Q', isVeg: false, available: true, prepTime: 13, complexity: 3, rating: 4.5, ratingCount: 145, tags: ['spicy', 'coastal'] },
    { id: 'ml11', name: 'Prawn Masala', description: 'Juicy prawns in spicy coconut masala', price: 230, category: 'lunch', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRhFNrv8gzurphZf1zoIQczGAD7xjD4yx1wA&s', isVeg: false, available: true, prepTime: 12, complexity: 3, rating: 4.5, ratingCount: 132, tags: ['premium', 'spicy'] },
    { id: 'ml12', name: 'Palak Paneer', description: 'Spinach with cottage cheese in light spices', price: 160, category: 'lunch', image: 'https://palatesdesire.com/wp-content/uploads/2021/05/palak-paneer-recipe@palates-desire.jpg', isVeg: true, available: true, prepTime: 10, complexity: 2, rating: 4.4, ratingCount: 148, tags: ['healthy', 'popular'] },
    { id: 'ml13', name: 'Shahi Paneer', description: 'Cottage cheese in royal creamy cashew gravy', price: 190, category: 'lunch', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHMd_iM3OmzVRdhXq52vDVxU5P4whaqioYkQ&s', isVeg: true, available: true, prepTime: 12, complexity: 2, rating: 4.5, ratingCount: 155, tags: ['premium', 'rich'] },
    { id: 'ml14', name: 'Egg Curry', description: 'Hard boiled eggs in spiced onion tomato gravy', price: 120, category: 'lunch', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsU-0hbmznZf3fSKqo6Tw23lNZvlAyqziGZg&s', isVeg: false, available: true, prepTime: 8, complexity: 2, rating: 4.2, ratingCount: 125, tags: ['quick', 'filling'] },
    { id: 'm5', name: 'Veg Thali', description: 'Complete meal with dal, sabzi, roti, rice, salad & papad', price: 150, category: 'lunch', image:'https://foodnextdoor.in/wp-content/uploads/2023/05/menu-1690960633-1665572911_1.jpg', isVeg: true, available: true, prepTime: 15, complexity: 3, rating: 4.7, ratingCount: 200, tags: ['complete', 'value'] },

    // Snacks
    { id: 'm9', name: 'Samosa', description: 'Crispy pastry filled with spiced potato & peas', price: 25, category: 'snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', isVeg: true, available: true, prepTime: 3, complexity: 1, rating: 4.5, ratingCount: 280, tags: ['crispy', 'quick'] },
    { id: 'ms2', name: 'Cutlet', description: 'Crispy shallow-fried vegetable patty', price: 40, category: 'snacks', image: 'https://www.chefajaychopra.com/assets/img/recipe/1-1687355245RailwayStyleVegCutletsjpg.jpg', isVeg: true, available: true, prepTime: 5, complexity: 1, rating: 4.2, ratingCount: 165, tags: ['crispy', 'popular'] },
    { id: 'ms3', name: 'Spring Roll', description: 'Crispy vegetable filled rolls - Indo-Chinese', price: 45, category: 'snacks', image: 'https://i.ytimg.com/vi/a9QdQ95GU6Y/hqdefault.jpg', isVeg: true, available: true, prepTime: 5, complexity: 1, rating: 4.1, ratingCount: 140, tags: ['crispy', 'indo-chinese'] },
    { id: 'm11', name: 'Chicken Roll', description: 'Grilled chicken wrapped in soft paratha with sauce', price: 80, category: 'snacks', image: 'https://thespicemess.com/wp-content/uploads/2021/06/Butter-Chicken-Roll-2-360x360.jpg', isVeg: false, available: true, prepTime: 6, complexity: 2, rating: 4.4, ratingCount: 155, tags: ['protein', 'filling'] },
    { id: 'ms5', name: 'Egg Roll', description: 'Egg and veggie wrap in paratha with sauce', price: 60, category: 'snacks', image: 'https://www.shutterstock.com/image-photo/egg-chicken-roll-popular-street-260nw-2639618009.jpg', isVeg: false, available: true, prepTime: 5, complexity: 1, rating: 4.2, ratingCount: 138, tags: ['quick', 'filling'] },
    { id: 'm12', name: 'French Fries', description: 'Crispy golden fries with spice & dipping sauce', price: 50, category: 'snacks', image: 'https://thumbs.dreamstime.com/b/crispy-golden-french-fries-ketchup-crispy-golden-french-fries-ketchup-399019127.jpg', isVeg: true, available: true, prepTime: 6, complexity: 1, rating: 4.1, ratingCount: 220, tags: ['crispy', 'popular'] },
    { id: 'ms7', name: 'Cheese Balls', description: 'Crispy balls with gooey melted cheese inside', price: 70, category: 'snacks', image: 'https://meltmeal.com/wp-content/uploads/2025/09/meryem.ben24_93682_A_modern_kitchen_with_marble_countertops_a_dff2ac2c-e56e-41e4-bf4c-616ed126941f_0.webp', isVeg: true, available: true, prepTime: 7, complexity: 1, rating: 4.3, ratingCount: 175, tags: ['cheese', 'crispy'] },
    { id: 'ms8', name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection', price: 120, category: 'snacks', image: 'https://spicecravings.com/wp-content/uploads/2020/10/Paneer-Tikka-Featured-1-500x500.jpg', isVeg: true, available: true, prepTime: 10, complexity: 2, rating: 4.5, ratingCount: 195, tags: ['grilled', 'popular'] },
    { id: 'ms9', name: 'Chicken Lollipop', description: '4 pcs crispy spiced chicken wings lollipop style', price: 110, category: 'snacks', image: 'https://cdn.prod.website-files.com/654369dcffba1c0eb478187e/676467ea7415e6e5715affd9_IMG_2965.jpeg', isVeg: false, available: true, prepTime: 9, complexity: 2, rating: 4.4, ratingCount: 188, tags: ['spicy', 'popular'] },
    { id: 'ms10', name: 'Gobi Manchurian', description: 'Cauliflower in tangy Indo-Chinese sauce', price: 90, category: 'snacks', image: 'https://rainbowplantlife.com/wp-content/uploads/2022/02/Gobi-Manchurian-closeup-1-of-1.jpg', isVeg: true, available: true, prepTime: 8, complexity: 2, rating: 4.3, ratingCount: 162, tags: ['indo-chinese', 'tangy'] },

    // Beverages
    { id: 'mb1', name: 'Filter Coffee', description: 'Authentic South Indian filter coffee with froth', price: 25, category: 'beverages', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYdOsbcA2oir3fICfJeflOige-KjVLBeXozA&s', isVeg: true, available: true, prepTime: 2, complexity: 1, rating: 4.8, ratingCount: 380, tags: ['hot', 'popular'] },
    { id: 'mb2', name: 'Tea', description: 'Classic masala chai with ginger & cardamom', price: 15, category: 'beverages', image: 'https://m.media-amazon.com/images/I/71Jl0CEwJdL._AC_UF894,1000_QL80_.jpg', isVeg: true, available: true, prepTime: 2, complexity: 1, rating: 4.7, ratingCount: 420, tags: ['hot', 'popular'] },
    { id: 'mb3', name: 'Cold Coffee', description: 'Blended iced coffee with ice cream & milk', price: 60, category: 'beverages', image: 'https://fleurfoodie.com/wp-content/uploads/2021/12/ijskoffie-2.jpg', isVeg: true, available: true, prepTime: 3, complexity: 1, rating: 4.5, ratingCount: 210, tags: ['cold', 'sweet'] },
    { id: 'mb4', name: 'Milkshake', description: 'Thick shake — Chocolate, Vanilla or Strawberry', price: 80, category: 'beverages', image: 'https://thumbs.dreamstime.com/b/hot-milkshakes-featuring-rich-chocolate-vanilla-strawberry-flavors-fresh-berries-dessert-menu-cafe-branding-food-blog-335456551.jpg', isVeg: true, available: true, prepTime: 4, complexity: 1, rating: 4.4, ratingCount: 195, tags: ['cold', 'sweet'] },
    { id: 'mb5', name: 'Fresh Juice', description: 'Freshly squeezed Orange, Mosambi or Watermelon', price: 50, category: 'beverages', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiI5YCRGCbS6Qu_N4gOaYrlFu4Ko9GNTDEdg&s', isVeg: true, available: true, prepTime: 3, complexity: 1, rating: 4.5, ratingCount: 230, tags: ['healthy', 'fresh'] },
    { id: 'mb6', name: 'Butter Milk', description: 'Chilled spiced chaas with jeera & coriander', price: 30, category: 'beverages', image: 'https://i0.wp.com/kitchenflavours.net/wp-content/uploads/2009/05/Corinader-Flavoured-buttermilk.jpg?resize=400%2C600&ssl=1', isVeg: true, available: true, prepTime: 2, complexity: 1, rating: 4.3, ratingCount: 155, tags: ['cold', 'healthy'] },
    { id: 'mb7', name: 'Soda', description: 'Chilled Limca, ThumsUp or Sprite', price: 25, category: 'beverages', image: 'https://twoclovesinapot.com/wp-content/uploads/2021/09/IMG_3139_jpg-scaled.jpg', isVeg: true, available: true, prepTime: 1, complexity: 1, rating: 4.0, ratingCount: 280, tags: ['cold', 'quick'] },
    { id: 'mb8', name: 'Lassi', description: 'Thick sweet or salted yogurt drink', price: 50, category: 'beverages', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbdWMKbc4iJjzLAwRBmdOwTz_SnTujaicW6A&s', isVeg: true, available: true, prepTime: 3, complexity: 1, rating: 4.5, ratingCount: 198, tags: ['cold', 'popular'] },

    // Dinner
    { id: 'md1', name: 'Chapati + Dal', description: '2 soft chapatis with yellow dal & pickle', price: 80, category: 'dinner', image: 'https://www.shutterstock.com/image-photo/roti-bhaji-indian-vegetarian-thali-600nw-2461110273.jpg', isVeg: true, available: true, prepTime: 8, complexity: 1, rating: 4.3, ratingCount: 175, tags: ['light', 'comfort'] },
    { id: 'md2', name: 'Parotta (2 pcs)', description: 'Crispy layered Kerala parotta with salna', price: 50, category: 'dinner', image: 'https://premasculinary.com/wp-content/uploads/2021/06/Saravana-Bhavan-Veg-Kurma-recipe-How-to-make-Kurma-using-an-Instant-Pot-Vegetable-Kurma-Recipe-in-Instant-Pot-768x1024.jpg', isVeg: true, available: true, prepTime: 6, complexity: 2, rating: 4.4, ratingCount: 188, tags: ['crispy', 'popular'] },
    { id: 'md3', name: 'Naan (1 pc)', description: 'Soft leavened bread from tandoor with butter', price: 40, category: 'dinner', image: 'https://www.cookwithmanali.com/wp-content/uploads/2014/11/Restaurant-Style-Naan.jpg', isVeg: true, available: true, prepTime: 5, complexity: 1, rating: 4.3, ratingCount: 165, tags: ['soft', 'popular'] },
    { id: 'md4', name: 'Chicken Curry', description: 'Home-style chicken curry with 2 chapatis', price: 180, category: 'dinner', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1cftPFuPsWuZsW0CJlceL4hoRL08qOuaDxw&s', isVeg: false, available: true, prepTime: 12, complexity: 2, rating: 4.5, ratingCount: 210, tags: ['comfort', 'popular'] },
    { id: 'md5', name: 'Mutton Curry', description: 'Tender slow-cooked mutton with 2 chapatis', price: 250, category: 'dinner', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2bGIP0NHeLiEYvyjBt-6OKQPDuyQNoVQBtA&s', isVeg: false, available: true, prepTime: 15, complexity: 3, rating: 4.6, ratingCount: 178, tags: ['premium', 'rich'] },
    { id: 'md6', name: 'Fish Fry', description: 'Crispy fried fish fillet with 2 chapatis & lemon', price: 200, category: 'dinner', image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2015/03/fish-fry-1.jpg', isVeg: false, available: true, prepTime: 12, complexity: 2, rating: 4.4, ratingCount: 155, tags: ['crispy', 'coastal'] },
    { id: 'm15', name: 'Veg Noodles', description: 'Indo-Chinese stir fried noodles with vegetables', price: 100, category: 'dinner', image: 'https://www.cookwithmanali.com/wp-content/uploads/2014/11/Hakka-Noodles-1.jpg', isVeg: true, available: true, prepTime: 8, complexity: 2, rating: 4.2, ratingCount: 145, tags: ['indo-chinese', 'quick'] },
    { id: 'md8', name: 'Egg Noodles', description: 'Stir fried noodles with egg & vegetables', price: 120, category: 'dinner', image: 'https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/ramen_noodles_with_egg_57412_16x9.jpg', isVeg: false, available: true, prepTime: 8, complexity: 2, rating: 4.3, ratingCount: 155, tags: ['indo-chinese', 'popular'] },
    { id: 'md9', name: 'Fried Rice', description: 'Wok-tossed rice — Veg, Chicken or Egg', price: 110, category: 'dinner', image: 'https://i.ytimg.com/vi/8kFT7b5qTK0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDaie7vFa1O-gk-TrlNrrIn1kJSeQ', isVeg: true, available: true, prepTime: 8, complexity: 2, rating: 4.3, ratingCount: 188, tags: ['indo-chinese', 'filling'] },
    { id: 'md10', name: 'Manchurian', description: 'Crispy veg or chicken balls in tangy gravy or dry', price: 90, category: 'dinner', image: 'https://i.ytimg.com/vi/nPPNmjiGCCk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBpSPEKcY0CCK-By9uh0oF_zjWobw', isVeg: true, available: true, prepTime: 7, complexity: 2, rating: 4.2, ratingCount: 162, tags: ['indo-chinese', 'tangy'] },

    // Combos
    { id: 'mc1', name: 'Student Combo', description: '1 Idli + 1 Vada + Filter Coffee — Save ₹20!', price: 80, category: 'combos', image: 'https://static.vecteezy.com/system/resources/previews/071/459/741/non_2x/south-indian-breakfast-idli-vada-chutney-and-filter-coffee-free-photo.jpg', isVeg: true, available: true, prepTime: 7, complexity: 1, rating: 4.6, ratingCount: 245, tags: ['value', 'bestseller', 'combo'] },
    { id: 'mc2', name: 'Lunch Combo', description: 'Chicken Biryani + Raita + Cold Drink — Save ₹40!', price: 200, category: 'combos', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNg5PxwsM9owzyDtkvespPKkTip87Aeq4c3w&s', isVeg: false, available: true, prepTime: 15, complexity: 3, rating: 4.7, ratingCount: 210, tags: ['value', 'bestseller', 'combo'] },
    { id: 'mc3', name: 'Snack Combo', description: 'Samosa + Cutlet + Masala Chai — Save ₹25!', price: 70, category: 'combos', image: 'https://i.ytimg.com/vi/RVLPA4ifMAU/mqdefault.jpg', isVeg: true, available: true, prepTime: 6, complexity: 1, rating: 4.5, ratingCount: 198, tags: ['value', 'snack', 'combo'] },
    { id: 'mc4', name: 'Dinner Combo', description: 'Chapati + Dal + Veg Curry — Save ₹30!', price: 120, category: 'combos', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN_pbbACOb1MYIVkyDWOy5MHX8ims5S-qYcw&s', isVeg: true, available: true, prepTime: 10, complexity: 2, rating: 4.5, ratingCount: 180, tags: ['value', 'dinner', 'combo'] },
    { id: 'mc5', name: 'Party Combo', description: 'Chicken Biryani + Chicken 65 + Cold Drink — Save ₹70!', price: 350, category: 'combos', image: 'https://pbs.twimg.com/media/CeyjuZcWQAAjjXW.jpg', isVeg: false, available: true, prepTime: 18, complexity: 3, rating: 4.8, ratingCount: 155, tags: ['premium', 'value', 'combo'] },
    { id: 'mc6', name: 'Veg Combo', description: 'Paneer Butter Masala + 2 Naan + Cold Drink — Save ₹50!', price: 250, category: 'combos', image: 'https://plain-apac-prod-public.komododecks.com/202605/19/xGWGwizBlFJiGwndt8DH/image.png', isVeg: true, available: true, prepTime: 14, complexity: 2, rating: 4.6, ratingCount: 172, tags: ['value', 'popular', 'combo'] },
];

export function initializeData() {
    if (!getItem(KEYS.USERS)) {
        setItem(KEYS.USERS, [
            { id: 'admin-1', name: 'Admin', email: 'admin@canteen.com', password: 'admin123', phone: '9999999999', role: 'admin', createdAt: new Date().toISOString() },
            { id: 'kitchen-1', name: 'Kitchen Staff', email: 'kitchen@canteen.com', password: 'kitchen123', phone: '8888888888', role: 'kitchen', createdAt: new Date().toISOString() },
            { id: 'user-demo', name: 'Demo User', email: 'user@demo.com', password: 'demo123', phone: '7777777777', role: 'user', createdAt: new Date().toISOString() },
        ]);
    }

    // Initialize menu if not set OR if it has fewer than 20 items (upgrade old data)
    const existingMenu = getItem(KEYS.MENU);
    if (!existingMenu || existingMenu.length < 20) {
        setItem(KEYS.MENU, EXPANDED_MENU);
    } else {
        const updatedMenu = existingMenu.map(item => {
            const masterItem = EXPANDED_MENU.find(menuItem => menuItem.id === item.id);
            return masterItem ? { ...item, image: masterItem.image } : item;
        });
        setItem(KEYS.MENU, updatedMenu);
    }

    if (!getItem(KEYS.ORDERS)) setItem(KEYS.ORDERS, []);

    if (!getItem(KEYS.SLOTS)) {
        const slots = [];
        for (let h = 8; h < 21; h++) {
            for (let m = 0; m < 60; m += 15) {
                const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                slots.push({ slot: time, isAvailable: true, maxOrders: 5, currentOrders: 0 });
            }
        }
        setItem(KEYS.SLOTS, slots);
    }

    // Always refresh coupons to pick up new ones
    const existingCoupons = getItem(KEYS.COUPONS) || [];
    if (existingCoupons.length < 17) {
        setItem(KEYS.COUPONS, [
            { code: 'WELCOME20', type: 'percent', value: 20, maxDiscount: 100, minOrder: 50, maxUses: 100, uses: 0, active: true, desc: '20% off on first order (max ₹100)' },
            { code: 'SAVE50', type: 'flat', value: 50, minOrder: 299, maxUses: 50, uses: 0, active: true, desc: '₹50 off on orders above ₹299' },
            { code: 'LUNCH30', type: 'percent', value: 30, maxDiscount: 150, minOrder: 80, maxUses: 200, uses: 0, active: true, desc: '30% off between 12 PM - 2 PM', timeWindow: { start: 12, end: 14 } },
            { code: 'FREESHIP', type: 'flat', value: 0, minOrder: 0, maxUses: 500, uses: 0, active: true, desc: 'Free packaging on your order' },
            { code: 'HAPPYHOUR', type: 'percent', value: 15, maxDiscount: 75, minOrder: 60, maxUses: 200, uses: 0, active: true, desc: '15% off Happy Hour 4 PM - 6 PM', timeWindow: { start: 16, end: 18 } },
            { code: 'STUDENT10', type: 'percent', value: 10, maxDiscount: 50, minOrder: 50, maxUses: 500, uses: 0, active: true, desc: '10% off for students' },
            { code: 'WEEKEND25', type: 'percent', value: 25, maxDiscount: 120, minOrder: 100, maxUses: 200, uses: 0, active: true, desc: '25% off on weekends', daysOfWeek: [0, 6] },
            { code: 'BIRTHDAY', type: 'percent', value: 25, maxDiscount: 100, minOrder: 50, maxUses: 1, uses: 0, active: true, desc: '25% birthday discount' },
            { code: 'REFER50', type: 'flat', value: 50, minOrder: 100, maxUses: 50, uses: 0, active: true, desc: '₹50 off - referral reward' },
            { code: 'FLAT30', type: 'flat', value: 30, minOrder: 100, maxUses: 50, uses: 0, active: true, desc: '₹30 off on orders above ₹100' },
            { code: 'LUNCH15', type: 'percent', value: 15, maxDiscount: 75, minOrder: 80, maxUses: 200, uses: 0, active: true, desc: '15% off on lunch items' },
            { code: 'SECRET25', type: 'percent', value: 25, maxDiscount: 150, minOrder: 50, maxUses: 50, uses: 0, active: true, desc: '🤫 Secret 25% off (hidden code)' },
            { code: 'SPIN5', type: 'percent', value: 5, maxDiscount: 50, minOrder: 0, maxUses: 999, uses: 0, active: true, desc: '5% off (Spin prize)' },
            { code: 'SPIN10', type: 'percent', value: 10, maxDiscount: 75, minOrder: 0, maxUses: 999, uses: 0, active: true, desc: '10% off (Spin prize)' },
            { code: 'SPIN15', type: 'percent', value: 15, maxDiscount: 100, minOrder: 0, maxUses: 999, uses: 0, active: true, desc: '15% off (Spin prize)' },
            { code: 'SPIN20', type: 'percent', value: 20, maxDiscount: 120, minOrder: 0, maxUses: 999, uses: 0, active: true, desc: '20% off (Spin prize)' },
            { code: 'SPIN10FLAT', type: 'flat', value: 10, minOrder: 0, maxUses: 999, uses: 0, active: true, desc: '₹10 off (Spin prize)' },
            { code: 'SPIN20FLAT', type: 'flat', value: 20, minOrder: 0, maxUses: 999, uses: 0, active: true, desc: '₹20 off (Spin prize)' },
        ].map(c => {
            // Preserve existing uses count
            const existing = existingCoupons.find(e => e.code === c.code);
            return existing ? { ...c, uses: existing.uses } : c;
        }));
    }

    if (getItem(KEYS.KILL_SWITCH) === null) setItem(KEYS.KILL_SWITCH, false);
    if (getItem(KEYS.TOKEN_COUNTER) === null) setItem(KEYS.TOKEN_COUNTER, 1);
    if (!getItem(KEYS.KITCHEN_QUEUE)) setItem(KEYS.KITCHEN_QUEUE, []);
    if (!getItem(KEYS.NOTIFICATIONS)) setItem(KEYS.NOTIFICATIONS, []);
    if (!getItem(KEYS.REVIEWS)) setItem(KEYS.REVIEWS, []);
    if (!getItem(KEYS.STREAKS)) setItem(KEYS.STREAKS, {});
    if (!getItem(KEYS.ORDER_TIMERS)) setItem(KEYS.ORDER_TIMERS, {});
}

export { KEYS };