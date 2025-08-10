import CustomHeader from "@/components/CustomHeader";
import { account, getAllOrders, getCurrentUser, getRecentOrders } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<any>(null); // order details pop-up

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);

        const recent = await getRecentOrders();
        setRecentOrders(recent);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const openModal = async () => {
    setIsModalVisible(true);
    setModalLoading(true);
    try {
      const orders = await getAllOrders();
      setAllOrders(orders);
    } catch (error) {
      console.error("Failed to load all orders:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); // logs out user
      
      // Reset auth state so (auth) layout doesn't redirect to "/"
    useAuthStore.getState().setIsAuthenticated(false);

    router.replace("/(auth)/sign-in"); // correct path to your sign-in file

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="pb-28 px-5 pt-5 bg-white h-full">
      <CustomHeader title="Profile" />

      {/* Profile Section */}
      <View className="flex-row items-center mt-5 gap-x-5">
        <View className="relative">
          <Image
            source={{ uri: user.avatar }}
            className="w-20 h-20 rounded-full border-2 border-white shadow"
          />
          <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-1 rounded-full">
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-black">{user.name}</Text>
          <Text className="text-gray-500 text-sm">{user.email}</Text>
          <TouchableOpacity className="mt-2 border border-primary py-1.5 px-3 rounded-full self-start">
            <Text className="text-primary text-sm font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* My Orders Section */}
      <View className="mt-8">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-black">My Orders</Text>
          <TouchableOpacity onPress={openModal}>
            <Text className="text-blue-500">View All</Text>
          </TouchableOpacity>
        </View>



        {recentOrders.length > 0 ? (
          <FlatList
            data={recentOrders}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <View className="p-4 border-b border-gray-200">
                <Text className="font-semibold">{item.itemName}</Text>
                <Text className="text-gray-500">{item.status}</Text>
                <Text className="text-gray-400 text-sm">
                  {new Date(item.$createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text className="text-gray-500">No recent orders</Text>
        )}
      </View>

      {/* Logout Button */}
      {/* <TouchableOpacity className="mt-6 border border-red-500 py-3 rounded-full items-center flex-row justify-center gap-x-2">
        <Ionicons name="log-out-outline" size={18} color="red" />
        <Text className="text-red-500 font-semibold">Logout</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        className="bg-red-500 py-3 rounded-full mt-5"
        onPress={handleLogout}
      >
        <Text className="text-white text-center font-semibold text-base">Logout</Text>
      </TouchableOpacity>

      {/* Modal for All Orders */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-black">All Orders</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {modalLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#f97316" />
            </View>
          ) : (
            <FlatList
              data={allOrders}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 border-b border-gray-200"
                  onPress={() => setSelectedOrder(item)}
                >
                  <Text className="font-semibold">{item.itemName}</Text>
                  <Text className="text-gray-500">{item.status}</Text>
                  <Text className="text-gray-400 text-sm">
                    {new Date(item.$createdAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Bottom Sheet for Order Details */}
      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-2xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-black">Order Details</Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <>
                <Text className="font-medium text-base">{selectedOrder.itemName}</Text>
                <Text className="text-gray-500">Status: {selectedOrder.status}</Text>
                <Text className="text-gray-500">
                  Date: {new Date(selectedOrder.$createdAt).toLocaleString()}
                </Text>
                <Text className="text-gray-500">
                  Total: ${selectedOrder.totalAmount || "N/A"}
                </Text>

                {/* Items List */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <View className="mt-3">
                    <Text className="font-semibold mb-2">Items:</Text>
                    {selectedOrder.items.map((itm: any, idx: number) => (
                      <Text key={idx} className="text-gray-600">
                        - {itm.name} x {itm.quantity}
                      </Text>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
