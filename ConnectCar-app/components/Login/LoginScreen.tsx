import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";
import Logo from "../Logo/Logo"

import { findUserByEmail } from "../../services/database";

const LoginScreen = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Por favor, preencha o código e a senha.");
      return;
    }
    setLoading(true);

    try {
      const user = await findUserByEmail(email);

      if (!user) {
        Alert.alert("Erro", "Usuário não encontrado.");
        setLoading(false); 
        return;
      }

      
      if (user.password === password) {
        Alert.alert("Login bem-sucedido!", `Bem-vindo, ${user.name}!`);
        
        router.replace("/home"); 
      } else {
        Alert.alert("Erro", "Senha incorreta.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um problema ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={20}
      style={tw`flex-1 bg-gray-500`}
    >
      {/* <<< NOVO: ScrollView para permitir a rolagem do conteúdo */}
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center items-center p-6`}
        keyboardShouldPersistTaps="handled"
      >
    
      <Logo />
      <Text style={tw`text-white text-2xl font-bold mb-6`}>ConnectCar</Text>

      <View style={tw`w-full mb-4`}>
        <Text style={tw`text-white mb-2`}>Email:</Text>
        <TextInput
          style={tw`w-full h-12 bg-gray-800 text-white px-4 rounded-lg`}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Digite seu email"
          placeholderTextColor="#aaa"
          editable={!loading}
        />
      </View>

      <View style={tw`w-full mb-6`}>
        <Text style={tw`text-white mb-2`}>Senha:</Text>
        <TextInput
          style={tw`w-full h-12 bg-gray-800 text-white px-4 rounded-lg`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Digite sua senha"
          placeholderTextColor="#aaa"
          editable={!loading}
        />
      </View>

      <TouchableOpacity
        style={tw.style(
          `w-full bg-green-500 p-3 rounded-lg flex-row justify-center items-center`,
          loading && "bg-green-800"
        )}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            Entrar
          </Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={tw`p-4`}
        onPress={() => router.push("/register")}
        disabled={loading}
      >
        <Text style={tw`text-white font-semibold text-center`}>
          Não tem conta? Clique aqui
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;