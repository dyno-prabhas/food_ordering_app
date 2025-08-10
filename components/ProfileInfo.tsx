import Profile from "@/app/(tabs)/profile";
import { getCurrentUser } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileItemProps {
  icon: string;
  label: string;
  value: any;
}

interface Order {
  $id: string;
  itemName: string;
  status: string;
  $createdAt: string;
}

const ProfileInfo = ({ setIsModalVisible } : any) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);

        
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </SafeAreaView>
    );
  }

  return (
    <>
     <View className="flex-row items-center mt-5 gap-x-10">
              {/* Profile Pic */}
              <View className="relative">
                <Image
                  source={{ uri: user.profilePic }}
                  className="w-20 h-20 rounded-full border-2 border-white shadow"
                />
                <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-1 rounded-full">
                  <Ionicons name="pencil" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
    
              {/* Name + Email + Edit */}
              <View className="flex-1">
                <Text className="text-lg font-semibold text-black">{user.name}</Text>
                <Text className="text-gray-500 text-sm">{user.email}</Text>
                <TouchableOpacity className="mt-2 border border-primary py-1.5 px-3 rounded-full self-start">
                  <Text className="text-primary text-sm font-medium">Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
    
            {/* Info Card */}
            <View className="bg-white rounded-xl p-5 mt-6 shadow">
              <ProfileItem icon="call" label="Phone number" value={user.phone} />
            </View>

            {/* My Orders Section */}
            <View className="flex-row justify-between items-center mt-8 px-5">
              <Text className="text-lg font-semibold text-black">My Orders</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text className="text-blue-500 text-sm">View All</Text>
              </TouchableOpacity>
            </View>
        </>
    
  );
};

const ProfileItem = ({ icon, label, value }: Profile) => (
  <View className="flex-row items-start gap-x-3 mb-5">
    <Ionicons name={icon} size={20} color="#FFA500" />
    <View className="flex-1">
      <Text className="text-gray-500 text-sm">{label}</Text>
      <Text className="text-black font-medium">{value}</Text>
    </View>
  </View>
);



export default ProfileInfo;
