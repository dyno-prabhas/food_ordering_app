import CustomHeader from "@/components/CustomHeader";
import ProfileInfo from "@/components/ProfileInfo";
import { getAllOrders, getRecentOrders } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Profile {
  icon: string;
  label: string;
  value: any;
}

interface Orders {
  title: string;
  date: any;
  status: string;
}

const Profile = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const recent = await getRecentOrders();
        setRecentOrders(recent);

        const all = await getAllOrders();
        setAllOrders(all);
        
      } catch (error) {
        console.error("Failed to load all orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="pb-6 px-5 pt-5 bg-white h-full">
      <CustomHeader title="Profile" />
      {/* My Orders Section */}
      <View className="">
        {recentOrders.length > 0 ? (
          <FlatList
            data={recentOrders}
            keyExtractor={(item) => item.$id}
            ListHeaderComponent={<ProfileInfo setIsModalVisible={setIsModalVisible} />}
            renderItem={({ item }) => (
              <OrderItem
                title={item.itemName}
                date={new Date(item.$createdAt).toLocaleDateString()}
                status={item.status}
              />
            )}
          />
        ) : (
          <Text className="text-gray-500">No recent orders</Text>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity className="mt-6 border border-red-500 py-3 rounded-full items-center flex-row justify-center gap-x-2">
        <Ionicons name="log-out-outline" size={18} color="red" />
        <Text className="text-red-500 font-semibold">Logout</Text>
      </TouchableOpacity>

      {/* Modal for All Orders */}
            <Modal
              visible={isModalVisible}
              animationType="fade"
              transparent
              onRequestClose={() => setIsModalVisible(false)}
            >
              <View className="flex-1 justify-end bg-black/40">
                <View className="bg-white rounded-t-2xl p-5 max-h-[70%]">
                  <Text className="text-lg font-semibold mb-4">All Orders</Text>
                  <FlatList
                    data={allOrders}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => (
                      <OrderItem
                        title={item.itemName}
                        date={new Date(item.$createdAt).toLocaleDateString()}
                        status={item.status}
                      />
                    )}
                    ListEmptyComponent={
                      <Text className="text-gray-500">No orders found</Text>
                    }
                  />
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    className="mt-4 bg-primary py-3 rounded-full"
                  >
                    <Text className="text-white text-center font-medium">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
    </SafeAreaView>
  );
};

const OrderItem = ({ title, date, status }: Orders) => (
  <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
    <View>
      <Text className="font-medium text-black">{title}</Text>
      <Text className="text-gray-500 text-xs">{date}</Text>
    </View>
    <Text className="text-primary font-semibold text-sm">{status}</Text>
  </View>
);

export default Profile;
