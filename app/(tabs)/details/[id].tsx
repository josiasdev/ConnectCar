import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { getOrderById, updateOrderStatus } from '../../../services/database';
import { Order } from '../../../types/order';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // CORREÇÃO APLICADA AQUI:
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (!id) {
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const orderDetails = await getOrderById(id);
          setOrder(orderDetails);
        } catch (error) {
          console.error("Erro ao buscar detalhes do pedido:", error);
          Alert.alert("Erro", "Não foi possível carregar os detalhes do pedido.");
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [id]) // A dependência é o 'id' do pedido. Se ele mudar, a busca roda de novo.
  );

  const handleUpdateStatus = async (newStatus: Order['status']) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      Alert.alert(
        "Sucesso!",
        `O pedido foi atualizado para "${newStatus}".`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderActionButtons = () => {
    if (!order) return null;
    if (isUpdating) {
      return <ActivityIndicator size="large" color="#34D399" style={{ marginTop: 20 }} />;
    }
    switch (order.status) {
      case 'Pendente':
        return (
          <TouchableOpacity style={styles.actionButton} onPress={() => handleUpdateStatus('Em trânsito')}>
            <FontAwesome5 name="truck" size={18} color="#1A202C" />
            <Text style={styles.actionButtonText}>Iniciar Entrega</Text>
          </TouchableOpacity>
        );
      case 'Em trânsito':
        return (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]} onPress={() => handleUpdateStatus('Concluído')}>
            <FontAwesome5 name="check-circle" size={18} color="#1A202C" />
            <Text style={styles.actionButtonText}>Finalizar Entrega</Text>
          </TouchableOpacity>
        );
      case 'Concluído':
        return (
          <View style={[styles.actionButton, styles.completedButton]}>
            <FontAwesome5 name="check-double" size={18} color="#E2E8F0" />
            <Text style={[styles.actionButtonText, { color: '#E2E8F0' }]}>Pedido Concluído</Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  if (!order) {
    return <View style={styles.center}><Text style={styles.emptyText}>Pedido não encontrado.</Text></View>;
  }
  
  const { payload } = order;
  const initialRegion = {
      latitude: (payload.pickup_lat + payload.dropoff_lat) / 2,
      longitude: (payload.pickup_lng + payload.dropoff_lng) / 2,
      latitudeDelta: Math.abs(payload.pickup_lat - payload.dropoff_lat) * 1.8,
      longitudeDelta: Math.abs(payload.pickup_lng - payload.dropoff_lng) * 1.8,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={20} color="#34D399" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Pedido</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.orderId}>ID: {order.id}</Text>
        <MapView style={styles.map} initialRegion={initialRegion} provider={PROVIDER_GOOGLE}>
          <Marker coordinate={{ latitude: payload.pickup_lat, longitude: payload.pickup_lng }} title="Coleta" pinColor="green" />
          <Marker coordinate={{ latitude: payload.dropoff_lat, longitude: payload.dropoff_lng }} title="Entrega" pinColor="red" />
        </MapView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status</Text>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cliente</Text>
          <Text style={styles.infoText}>{payload.customer_name}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Coleta</Text>
          <Text style={styles.infoText}>{payload.pickup_address}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrega</Text>
          <Text style={styles.infoText}>{payload.dropoff_address}</Text>
        </View>
        <View style={styles.actionsContainer}>
          {renderActionButtons()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0F1E' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0F1E' },
    emptyText: { color: '#A0AEC0', fontSize: 18 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A202C' },
    backButton: { padding: 8 },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
    scrollContainer: { paddingBottom: 40 },
    orderId: { color: '#A0AEC0', fontSize: 16, textAlign: 'center', marginVertical: 16 },
    map: { width: '100%', height: 250, marginBottom: 16 },
    card: { backgroundColor: '#1A202C', padding: 16, marginHorizontal: 16, marginBottom: 12, borderRadius: 12 },
    cardTitle: { color: '#A0AEC0', fontSize: 14, marginBottom: 6 },
    statusText: { color: 'white', fontSize: 18, fontWeight: 'bold', textTransform: 'capitalize' },
    infoText: { color: 'white', fontSize: 16 },
    actionsContainer: { marginTop: 20, paddingHorizontal: 16 },
    actionButton: { flexDirection: 'row', backgroundColor: '#34D399', padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    actionButtonText: { color: '#1A202C', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    completedButton: { backgroundColor: '#2D3748' },
});