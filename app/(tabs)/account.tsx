import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../app/_layout'; // Importando nosso hook de autenticação

export default function AccountScreen() {
  // 1. Pegamos os dados do usuário e a função signOut do nosso contexto global
  const { user, signOut } = useAuth();

  // Função para confirmar e executar o logout
  const handleSignOut = () => {
    Alert.alert(
      "Sair da Conta",
      "Você tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sim, Sair", 
          onPress: () => signOut(), // 2. Chamamos a função signOut do contexto
          style: "destructive"
        }
      ]
    );
  };

  // Se, por algum motivo, o usuário não estiver disponível, não renderiza nada
  if (!user) {
    return null; 
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Minha Conta</Text>
      
      <View style={styles.content}>
        <View style={styles.userInfoCard}>
          <View style={styles.avatar}>
            <FontAwesome5 name="user-alt" size={40} color="#34D399" />
          </View>
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between', // Empurra o botão de logout para baixo
  },
  userInfoCard: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#A0AEC0',
    fontSize: 16,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Fundo vermelho transparente
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444', // Borda vermelha
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});