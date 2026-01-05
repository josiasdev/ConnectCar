import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { initDatabase, findUserByEmail } from '../services/database'; // MUDANÇA: Importamos a função findUserByEmail
import { ActivityIndicator, View } from 'react-native';
import { User } from '../types/user'; // MUDANÇA: Usaremos nosso tipo User

// MUDANÇA: Atualizamos a assinatura da função signIn no tipo do contexto
type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  user: User | null;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const authContextValue = {
    // MUDANÇA: signIn agora é uma função async que realmente faz a autenticação
    signIn: async (email: string, password: string) => {
      const foundUser = await findUserByEmail(email);

      if (!foundUser) {
        throw new Error("Usuário não encontrado.");
      }

      if (foundUser.password !== password) {
        throw new Error("Senha incorreta.");
      }
      
      // Se tudo deu certo, define o usuário real no estado
      setUser(foundUser);
    },
    signOut: () => setUser(null),
    user,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

// O restante do arquivo (RootLayoutNav e RootLayout) pode continuar o mesmo, pois ele já reage a 'user'
function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    if (user && !inTabsGroup) {
      router.replace('/(tabs)/dashboard');
    } else if (!user && inTabsGroup) {
      router.replace('/');
    }
  }, [user, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="details/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((e) => console.error("Erro ao inicializar o banco de dados:", e));
  }, []);

  if (!dbReady) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}