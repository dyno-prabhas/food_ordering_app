// import { ID } from "react-native-appwrite";
// import { appwriteConfig, databases } from "./appwrite";

// async function bulkLinkMenuCustomizations(
//   links: { menuName: string; customizationNames: string[] }[]
// ) {
//   try {
//     // 1. Get all menu items
//     const menuDocs = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.menuCollectionId
//     );

//     // 2. Get all customizations
//     const customizationDocs = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.customizationsCollectionId
//     );

//     // 3. Create lookup maps
//     const menuMap = Object.fromEntries(
//       menuDocs.documents.map((doc) => [doc.name, doc.$id])
//     );
//     const customizationMap = Object.fromEntries(
//       customizationDocs.documents.map((doc) => [doc.name, doc.$id])
//     );

//     // 4. Loop through all links and create menu_customizations docs
//     for (const link of links) {
//       const menuId = menuMap[link.menuName];
//       if (!menuId) {
//         console.warn(`⚠️ Menu not found: ${link.menuName}`);
//         continue;
//       }

//       const validCustomizationIds = link.customizationNames
//         .map((name) => customizationMap[name])
//         .filter(Boolean);

//       await Promise.all(
//         validCustomizationIds.map((cusId) =>
//           databases.createDocument(
//             appwriteConfig.databaseId,
//             appwriteConfig.menuCustomizationsCollectionId,
//             ID.unique(),
//             { menu: menuId, customizations: cusId }
//           )
//         )
//       );
//     }

//     console.log("✅ All menu_customizations linked successfully.");
//   } catch (error) {
//     console.error("❌ Bulk link failed:", error);
//   }
// }

// // Example usage:
// bulkLinkMenuCustomizations([
//   {
//     menuName: "Classic Cheeseburger",
//     customizationNames: ["Extra Cheese", "Coke", "Fries", "Onions", "Bacon"],
//   },
//   {
//     menuName: "Pepperoni Pizza",
//     customizationNames: [
//                 "Extra Cheese",
//                 "Jalapeños",
//                 "Garlic Bread",
//                 "Coke",
//                 "Olives",
//             ],
//   },
//   {
//     menuName: "Bean Burrito",
//     customizationNames: ["Jalapeños", "Iced Tea", "Fries", "Salad"],
//   },
//   {
//     menuName: "Chicken Caesar Wrap",
//     customizationNames: ["Extra Cheese", "Coke", "Potato Wedges", "Tomatoes"],
//   },
//   {
//     menuName: "Grilled Veggie Sandwich",
//     customizationNames: ["Mushrooms", "Olives", "Mozzarella Sticks", "Iced Tea"],
//   },
//   {
//     menuName: "Mexican Burrito Bowl",
//     customizationNames: ["Avocado", "Sweet Corn", "Salad", "Iced Tea"],
//   },
//   {
//     menuName: "Classic Margherita Pizza",
//     customizationNames: ["Extra Cheese", "Olives", "Coke", "Garlic Bread"],
//   },
//   {
//     menuName: "Chicken Club Sandwich",
//     customizationNames: ["Bacon", "Tomatoes", "Mozzarella Sticks", "Iced Tea"],
//   },

// ]);
