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
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from './_layout'; // Hook de autenticação do layout raiz
import Logo from "@/components/Logo/Logo";

// Supondo que você tenha um componente de Logo
// import Logo from '../components/Logo'; 

const LoginScreen = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Por favor, preencha o Email e a Senha.");
      return;
    }
    setLoading(true);

    try {
      // A mágica acontece aqui: chamamos a função centralizada de login.
      await signIn(email, password);
      // Se o login for bem-sucedido, o useEffect no _layout.tsx
      // irá nos redirecionar para o dashboard automaticamente.

    } catch (error: any) {
      // Se o signIn der erro (usuário não encontrado, senha errada),
      // o erro será capturado e exibido aqui.
      Alert.alert("Erro no Login", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Logo/>
          <Text style={styles.title}>ConnectCar</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Digite seu email"
              placeholderTextColor="#A0AEC0"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Digite sua senha"
              placeholderTextColor="#A0AEC0"
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1A202C" />
            ) : (
              <Text style={styles.buttonText}>
                Entrar
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/register")}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Não tem conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6B7280',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    color: 'white',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1A202C',
    color: 'white',
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#34D399',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#2D3748',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 16,
  },
  linkText: {
    color: '#93C5FD',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoginScreen;