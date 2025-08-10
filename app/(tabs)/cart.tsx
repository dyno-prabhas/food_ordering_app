import { useCartStore } from "@/store/cart.store";
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
// import Toast from 'react-native-toast-message';

import CustomButton from "@/components/CustomButton";
import cn from "clsx";

import CartItem from '@/components/CartItem';
import CustomHeader from '@/components/CustomHeader';
import { createOrder } from "@/lib/appwrite";
import { PaymentInfoStripeProps } from '@/type';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);

const EmptyCart = () => (
    <View className="flex-1 justify-center items-center mt-32 px-5">
      {/* Cart Illustration */}
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text className="text-lg font-semibold text-dark-100 mt-5 mb-2">Your Cart is Empty</Text>
      <Text className="text-gray-500 text-center mt-1">
        Looks like you haven’t added anything yet.  
        Start exploring and find something delicious!
      </Text>
      <CustomButton
        title="Browse Menu"
        style="mt-6 w-full"
        onPress={() => router.push("/")}
      />
    </View>
);


const Cart = () => {
    const { items, getTotalItems, getTotalPrice } = useCartStore();

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();


    const handleOrderNow = async () => {
    try {
      const { items, getTotalPrice, clearCart } = useCartStore.getState();
      const totalPrice = getTotalPrice();

      await createOrder({
        items: items.map((i) => i.name),
        total: totalPrice + 5 - 0.5,
      });

      console.log("Order placed successfully!");
      
    //   Toast.show({ type: "success", text1: "Order placed successfully!" });
      clearCart();
    } catch (err) {
        console.log("Failed to place order");
      //Toast.show({ type: "error", text1: "Failed to place order" });
    }
  
    };

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerClassName="pb-28 px-5 pt-5"
                ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
                ListEmptyComponent={EmptyCart}
                ListFooterComponent={() => totalItems > 0 && (
                    <View className="gap-5">
                        <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                            <Text className="h3-bold text-dark-100 mb-5">
                                Payment Summary
                            </Text>

                            <PaymentInfoStripe
                                label={`Total Items (${totalItems})`}
                                value={`$${totalPrice.toFixed(2)}`}
                            />
                            <PaymentInfoStripe
                                label={`Delivery Fee`}
                                value={`$5.00`}
                            />
                            <PaymentInfoStripe
                                label={`Discount`}
                                value={`- $0.50`}
                                valueStyle="!text-success"
                            />
                            <View className="border-t border-gray-300 my-2" />
                            <PaymentInfoStripe
                                label={`Total`}
                                value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
                                labelStyle="base-bold !text-dark-100"
                                valueStyle="base-bold !text-dark-100 !text-right"
                            />
                        </View>

                        <CustomButton title="Order Now" onPress={handleOrderNow} />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Cart

