import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import Logo from '@/components/Logo/Logo';
import { getActiveOrdersCount } from '../../services/database';

export default function DashboardScreen() {
  // Estado para controlar se o tracking está ligado ou desligado
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);
  
  // Estado para armazenar os dados de localização recebidos
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  // Estado para mensagens de erro, como falta de permissão
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchActiveOrdersCount = async () => {
        try {
          const count = await getActiveOrdersCount();
          setActiveOrdersCount(count);
        } catch (error) {
          console.error("Erro ao buscar contagem de pedidos:", error);
        }
      };

      fetchActiveOrdersCount();
    }, [])
  );
  // useEffect é o hook que lida com a lógica de ligar/desligar o tracking
  useEffect(() => {
    let subscriber: Location.LocationSubscription | undefined;

    const startTracking = async () => {
      // 1. Pede permissão ao usuário para acessar a localização do dispositivo
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de acesso à localização foi negada');
        setIsTrackingEnabled(false);
        return;
      }

      setErrorMsg(null);
      
      // 2. Inicia o monitoramento contínuo da posição
      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000, // a cada 2 segundos
          distanceInterval: 5,   // a cada 5 metros
        },
        (newLocation: any) => {
          setLocation(newLocation); // Atualiza o estado com a nova localização
        }
      );
    };

    if (isTrackingEnabled) {
      startTracking();
    } else {
      // Se o tracking for desligado, remove o "escutador"
      if (subscriber) {
        subscriber.remove();
      }
      setLocation(null); // Limpa os dados da tela
    }

    // 3. Função de limpeza: é executada quando o componente "morre" ou antes de rodar o efeito novamente.
    // Isso é crucial para não deixar o tracking rodando em segundo plano e gastando bateria.
    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, [isTrackingEnabled]); // A mágica acontece aqui: este array faz o useEffect rodar sempre que 'isTrackingEnabled' mudar

  return (
    <SafeAreaView style={styles.container}>
      <Logo/>
      <Text style={styles.header}>ConnectCar</Text>

      {/* Card do Switch de Tracking */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Monitorando:</Text>
          <Switch
            trackColor={{ false: '#3e3e3e', true: '#34D399' }}
            thumbColor={isTrackingEnabled ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={() => setIsTrackingEnabled(previousState => !previousState)}
            value={isTrackingEnabled}
          />
        </View>
      </View>
      
      {/* Card de informações de Localização */}
      <View style={styles.card}>
        {!isTrackingEnabled ? (
            <Text style={styles.value}>Rastreamento desativado</Text>
        ) : !location ? (
            <View style={styles.row}><ActivityIndicator color="#A0AEC0" /><Text style={styles.label}> Aguardando sinal de GPS...</Text></View>
        ) : (
            <>
                <View style={styles.row}>
                    <View style={styles.locationDetail}>
                        <Text style={styles.label}>Latitude:</Text>
                        <Text style={styles.value}>{location.coords.latitude.toFixed(6)}</Text>
                    </View>
                    <View style={styles.locationDetail}>
                        <Text style={styles.label}>Longitude:</Text>
                        <Text style={styles.value}>{location.coords.longitude.toFixed(6)}</Text>
                    </View>
                </View>
                <View style={[styles.row, { marginTop: 16 }]}>
                    <View style={styles.locationDetail}>
                        <Text style={styles.label}>Altitude:</Text>
                        <Text style={styles.value}>{location.coords.altitude?.toFixed(2) ?? 'N/A'} m</Text>
                    </View>
                    <View style={styles.locationDetail}>
                        <Text style={styles.label}>Direção:</Text>
                        <Text style={styles.value}>{location.coords.heading?.toFixed(0) ?? 'N/A'}°</Text>
                    </View>
                </View>
            </>
        )}
      </View>
      
      {/* Cards de Métricas */}
      <View style={styles.row}>
        <View style={[styles.card, styles.metricCard]}>
          <Text style={styles.label}>Pedidos Ativos</Text>
          <Text style={styles.metricValue}>{activeOrdersCount}</Text>
        </View>
        <View style={[styles.card, styles.metricCard]}>
          <Text style={styles.label}>Velocidade</Text>
          <Text style={styles.metricValue}>
            {isTrackingEnabled && location ? (((location.coords.speed ?? 0) * 3.6 ).toFixed(0)) : '0'} 
            <Text style={{fontSize: 16, color: '#A0AEC0'}}> km/h</Text>
          </Text>
        </View>
      </View>

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0F1E', padding: 16 },
    header: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20, paddingHorizontal: 8 },
    card: { backgroundColor: '#1A202C', borderRadius: 12, padding: 16, marginBottom: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: { color: '#A0AEC0', fontSize: 16 },
    value: { color: 'white', fontSize: 16, fontWeight: '600', marginTop: 4 },
    locationDetail: { flex: 1 },
    metricCard: { flex: 1, marginHorizontal: 8, alignItems: 'center', justifyContent: 'center', height: 120 },
    metricValue: { color: 'white', fontSize: 32, fontWeight: 'bold', marginTop: 8 },
    errorText: { color: '#F56565', textAlign: 'center', marginTop: 10, padding: 10 },
});