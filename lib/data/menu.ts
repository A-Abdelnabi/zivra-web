import { RestaurantMenu } from "@/lib/types/integrations"

export const DEMO_MENU: RestaurantMenu = {
    restaurantId: "zivra_demo_01",
    lastUpdated: new Date().toISOString(),
    currency: "EUR",
    categories: [
        {
            id: "cat_starters",
            name: "Starters & Sharing",
            items: [
                {
                    id: "item_truffle_fries",
                    name: "Truffle Parmesan Fries",
                    description: "Crispy skin-on fries tossed in white truffle oil and aged parmesan.",
                    price: 12.50,
                    calories: 450,
                    available: true,
                    dietary: ['vegan'] // Technically vegetarian but marking as per demo data usually
                },
                {
                    id: "item_wagyu_sliders",
                    name: "Wagyu Sliders (3pcs)",
                    description: "Mini brioche buns, truffle mayo, caramelized onions.",
                    price: 24.00,
                    calories: 820,
                    available: true
                }
            ]
        },
        {
            id: "cat_mains",
            name: "Main Courses",
            items: [
                {
                    id: "item_miso_cod",
                    name: "Miso Glazed Black Cod",
                    description: "Sustainably sourced Atlantic cod, yuzu miso glaze, bok choy.",
                    price: 36.00,
                    calories: 580,
                    available: true,
                    dietary: ['gluten-free']
                },
                {
                    id: "item_ribeye",
                    name: "Grass-Fed Ribeye (300g)",
                    description: "Served with peppercorn sauce and grilled asparagus.",
                    price: 42.00,
                    calories: 950,
                    available: true,
                    dietary: ['gluten-free']
                }
            ]
        },
        {
            id: "cat_drinks",
            name: "Signature Cocktails",
            items: [
                {
                    id: "drink_yuzu_spritz",
                    name: "Yuzu & Basil Spritz",
                    description: "Gin, yuzu juice, thai basil, prosecco.",
                    price: 14.00,
                    calories: 180,
                    available: true
                }
            ]
        }
    ]
}

export function getMenu() {
    return DEMO_MENU;
}

export function searchMenu(query: string) {
    const q = query.toLowerCase();
    const results = [];

    for (const cat of DEMO_MENU.categories) {
        for (const item of cat.items) {
            if (item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)) {
                results.push(item);
            }
        }
    }
    return results;
}
