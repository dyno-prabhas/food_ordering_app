import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {

    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.dyno.foodordering",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: '6895a0ab0003a3059df7',
    bucketId: '68963b8c003a458be99a',
    userCollectionId: '6895a0f5001b294346dd',
    categoriesCollectionId: '6896364b0005b09bb3b3',
    menuCollectionId: '689636e000392174d1a5',
    customizationsCollectionId: '6896386b000b3a913117',
    menuCustomizationsCollectionId: '6896397700197d4ca3ff',
    ordersCollectionId: '689742c0001759c3f737',
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        )

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const createOrder = async ({ items, total }: { items: string[], total: number}) => {
  try {
    
    const currentAccount = await getCurrentUser();

    // const orderName = items.length > 1 
    //   ? `${items[0].name} and more` 
    //   : items[0].name;

    console.log(currentAccount);
    

    // Create Order document
    const order = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      ID.unique(),
      {
        user: currentAccount.$id,
        items,
        total,
        status: "Pending",
        createdAt: new Date().toISOString(),
      }
    );

    // Update user's orders relationship
    const userDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (userDocs.total > 0) {
      const user = userDocs.documents[0];
      const updatedOrders = [...(user.orders || []), order.$id];

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.$id,
        { orders: updatedOrders }
      );
    }

    return order;
  } catch (e) {
    console.error("Error creating order:", e);
    throw e;
  }
};

// Get recent orders
export const getRecentOrders = async () => {
  try {
    const currentAccount = await getCurrentUser();

    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      [
        Query.equal("user", currentAccount.$id),
        Query.orderDesc("createdAt"),
        Query.limit(3)
      ]
    );

    return orders.documents;
  } catch (e) {
    console.error("Error fetching orders:", e);
    throw e;
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const currentAccount = await getCurrentUser();

    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      [Query.equal("user", currentAccount.$id), Query.orderDesc("createdAt")]
    );

    return orders.documents;
  } catch (e) {
    console.error("Error fetching all orders:", e);
    throw e;
  }
};