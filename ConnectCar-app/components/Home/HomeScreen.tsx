import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import Logo from "../Logo/Logo";

const HomeScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-900`}>
        <Logo/>
      <Text style={tw`text-white text-2xl font-bold`}>Bem-vindo ao ConnectCar!</Text>
    </View>
  );
};

export default HomeScreen;
