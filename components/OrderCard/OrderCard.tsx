import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { Order } from '../../types/order'; // Certifique-se que o caminho está correto

type OrderCardProps = {
  order: Order;
};

// Um pequeno componente para reutilizar na grade de detalhes
const DetailItem = ({ label, value }: { label: string, value: string | null }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

export const OrderCard = ({ order }: OrderCardProps) => {
  const { payload, status } = order;

  // Calcula a região do mapa para mostrar ambas as paradas
  const initialRegion = {
    latitude: (payload.pickup_lat + payload.dropoff_lat) / 2,
    longitude: (payload.pickup_lng + payload.dropoff_lng) / 2,
    latitudeDelta: Math.abs(payload.pickup_lat - payload.dropoff_lat) * 2,
    longitudeDelta: Math.abs(payload.pickup_lng - payload.dropoff_lng) * 2,
  };
  
  // Define a cor do status
  const getStatusColor = () => {
    if (status === 'Concluído') return '#10B981'; // Verde
    if (status === 'Em trânsito') return '#3B82F6'; // Azul
    return '#F59E0B'; // Amarelo para Pendente
  };

  return (
    <View style={styles.card}>
      {/* Cabeçalho do Card */}
      <View style={styles.header}>
        <FontAwesome5 name="box-open" size={20} color="#A0AEC0" />
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Mapa */}
      <MapView style={styles.map} initialRegion={initialRegion} scrollEnabled={false} provider={PROVIDER_GOOGLE}>
        <Marker coordinate={{ latitude: payload.pickup_lat, longitude: payload.pickup_lng }} title="Coleta" pinColor="green"/>
        <Marker coordinate={{ latitude: payload.dropoff_lat, longitude: payload.dropoff_lng }} title="Entrega" pinColor="red" />
      </MapView>

      {/* Lista de Paradas */}
      <View style={styles.stopsContainer}>
        {/* Linha vertical que conecta os pontos */}
        <View style={styles.connectingLine} />
        
        {/* Parada de Coleta */}
        <View style={styles.stopRow}>
          <View style={[styles.stopCircle, { borderColor: 'green' }]}>
            <Text style={styles.stopNumber}>1</Text>
          </View>
          <Text style={styles.stopAddress} numberOfLines={1}>{payload.pickup_address}</Text>
        </View>

        {/* Parada de Entrega */}
        <View style={styles.stopRow}>
          <View style={[styles.stopCircle, { borderColor: 'red' }]}>
            <Text style={styles.stopNumber}>2</Text>
          </View>
          <Text style={styles.stopAddress} numberOfLines={1}>{payload.dropoff_address}</Text>
          <FontAwesome5 name="truck" size={16} color="#A0AEC0" style={{ marginLeft: 'auto' }} />
        </View>
      </View>

      {/* Grade de Detalhes Adicionais */}
      <View style={styles.detailsGrid}>
        <DetailItem label="Customer:" value={payload.customer_name} />
        <DetailItem label="POD Required:" value="Photo" />
        <DetailItem label="ETA:" value="2m 13s" />
        <DetailItem label="Date Scheduled:" value={order.scheduled_for} />
        <DetailItem label="Dispatched At:" value="Apr 1, 2025 21:40" />
        <DetailItem label="ECT:" value="Apr 2nd, 2025 12:.." />
      </View>
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  orderId: {
    color: '#E2E8F0',
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 12,
  },
  statusBadge: {
    marginLeft: 'auto',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  map: {
    width: '100%',
    height: 150,
  },
  stopsContainer: {
    padding: 16,
    backgroundColor: '#2D3748', // Um tom um pouco mais claro
  },
  connectingLine: {
    position: 'absolute',
    left: 24, // Centralizado no círculo
    top: 30,
    bottom: 30,
    width: 2,
    backgroundColor: '#4A5568',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  stopCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1A202C',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  stopAddress: {
    color: '#E2E8F0',
    fontSize: 14,
    flex: 1, // Permite que o texto quebre a linha se necessário
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  detailItem: {
    width: '50%', // Duas colunas
    paddingVertical: 8,
  },
  detailLabel: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});