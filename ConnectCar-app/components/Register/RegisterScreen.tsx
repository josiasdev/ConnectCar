import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";
import Logo from "../Logo/Logo";

import { initDatabase, addUser } from "../../services/database";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    initDatabase().catch((err) => {
      console.error("Erro ao inicializar o banco de dados:", err);
      Alert.alert("Erro", "Não foi possível inicializar o banco de dados.");
    });
  }, []);

  const handleRegister = async () => {

    if (!name || !email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await addUser(name, email, password);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("UNIQUE constraint failed")) {
        Alert.alert("Erro no Cadastro", "Este e-mail já está em uso.");
      } else {
        Alert.alert("Erro no Cadastro", "Não foi possível salvar os dados localmente.");
      }
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
      
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center items-center p-6`}
        keyboardShouldPersistTaps="handled"
      >

      <Logo/>
      <Text style={tw`text-white text-2xl font-bold mb-6`}>ConnectCar</Text>

      <View style={tw`w-full mb-4`}>
        <Text style={tw`text-white mb-2`}>Nome:</Text>
        <TextInput
          style={tw`w-full h-12 bg-gray-800 text-white px-4 rounded-lg`}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
          placeholderTextColor="#aaa"
          editable={!loading}
        />
      </View>

      <View style={tw`w-full mb-4`}>
        <Text style={tw`text-white mb-2`}>Email:</Text>
        <TextInput
          style={tw`w-full h-12 bg-gray-800 text-white px-4 rounded-lg`}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            Cadastrar
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`p-4`}
        onPress={() => router.push("/login")}
        disabled={loading}
      >
        <Text style={tw`text-blue-300 text-center`}>
          Já tem uma conta? Faça Login
        </Text>
      </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
