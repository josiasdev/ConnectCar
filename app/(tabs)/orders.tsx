import React, { useState, useCallback, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView, Platform
} from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect } from '@react-navigation/native';

import { Link } from 'expo-router';

import { FontAwesome5 } from '@expo/vector-icons';

import { getOrders, addOrder } from '../../services/database';

import { Order, OrderPayload } from '../../types/order'; // Certifique-se que o caminho está correto

import { OrderCard } from '../../components/OrderCard/OrderCard'; // Certifique-se que o caminho está correto



// Função para formatar a data como YYYY-MM-DD

const formatDate = (date: Date) => date.toISOString().split('T')[0];



export default function OrdersScreen() {

  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());



  // Lógica para o seletor de datas

  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {

    const today = new Date();

    const dateArray = Array.from({ length: 15 }, (_, i) => {

      const newDate = new Date(today);

      newDate.setDate(today.getDate() + (i - 7));

      return newDate;

    });

    setDates(dateArray);

  }, []);



  const loadOrders = useCallback(async () => {

    setLoading(true);

    try {

      const dateString = formatDate(selectedDate);

      const localOrders = await getOrders(dateString);

      setOrders(localOrders);

    } catch (error) {

      console.error("Falha ao carregar pedidos", error);

    } finally {

      setLoading(false);

    }

  }, [selectedDate]);



  useFocusEffect(useCallback(() => {

    loadOrders();

  }, [loadOrders]));



  // Estados e lógica para o modal de criação

  const [isModalVisible, setModalVisible] = useState(false);

  const [customerName, setCustomerName] = useState('');

  const [pickupAddress, setPickupAddress] = useState('');

  const [dropoffAddress, setDropoffAddress] = useState('');



  const handleCreateOrder = async () => {

    if (!customerName || !pickupAddress || !dropoffAddress) {

      Alert.alert("Atenção", "Preencha todos os campos.");

      return;

    }

    try {

      const orderId = `ORD-${Date.now()}`;

      const payload: OrderPayload = {

        customer_name: customerName,

        pickup_address: pickupAddress,

        dropoff_address: dropoffAddress,

        pickup_lat: -4.9705, pickup_lng: -39.0155,

        dropoff_lat: -4.9784, dropoff_lng: -39.0543,

      };

      await addOrder(orderId, payload, formatDate(selectedDate));

      Alert.alert("Sucesso!", "Novo pedido criado.");

      setModalVisible(false);

      setCustomerName('');

      setPickupAddress('');

      setDropoffAddress('');

      loadOrders();

    } catch (e) {

      console.error("Erro ao criar pedido:", e);

      Alert.alert("Erro", "Não foi possível criar o pedido.");

    }

  };



  return (

    <SafeAreaView style={styles.container}>

      {/* Seletor de Datas */}

      <View style={styles.dateSelectorContainer}>

        <FlatList

          horizontal

          data={dates}

          keyExtractor={item => item.toISOString()}

          renderItem={({ item }) => {

            const isSelected = formatDate(item) === formatDate(selectedDate);

            return (

              <TouchableOpacity onPress={() => setSelectedDate(item)} style={[styles.dateButton, isSelected && styles.dateButtonSelected]}>

                <Text style={[styles.dayText, isSelected && styles.selectedText]}>{item.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', '')}</Text>

                <Text style={[styles.dateText, isSelected && styles.selectedText]}>{item.getDate()}</Text>

              </TouchableOpacity>

            )

          }}

          showsHorizontalScrollIndicator={false}

          // Para centralizar a data de hoje ao iniciar

          initialScrollIndex={7}

          getItemLayout={(data, index) => ({ length: 70, offset: 70 * index, index })}

        />

      </View>


      {/* Lista de Pedidos */}

      {loading ? (

        <View style={styles.center}><ActivityIndicator size="large" color="#FFFFFF" /></View>

      ) : (

        <FlatList

          data={orders}

          keyExtractor={(item) => item.id}

          renderItem={({ item }) => (

            <Link href={{ pathname: "/details/[id]", params: { id: item.id } }} asChild>

              <TouchableOpacity>

                <OrderCard order={item} />

              </TouchableOpacity>

            </Link>

          )}

          ListEmptyComponent={<View style={styles.center}><Text style={{ color: '#A0AEC0' }}>Nenhum pedido para esta data.</Text></View>}

          contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}

        />

      )}



      {/* Botão Flutuante (FAB) */}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>

        <FontAwesome5 name="plus" size={20} color="white" />

      </TouchableOpacity>



      {/* ----- INÍCIO DO CÓDIGO DO MODAL ----- */}

      <Modal

        visible={isModalVisible}

        onRequestClose={() => setModalVisible(false)}

        transparent={true}

        animationType="slide"

      >

        <KeyboardAvoidingView

          behavior={Platform.OS === "ios" ? "padding" : "height"}

          style={styles.modalContainer}

        >

          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>Criar Novo Pedido</Text>

            <TextInput

              placeholder="Nome do Cliente"

              placeholderTextColor="#999"

              style={styles.input}

              value={customerName}

              onChangeText={setCustomerName}

            />

            <TextInput

              placeholder="Endereço de Coleta"

              placeholderTextColor="#999"

              style={styles.input}

              value={pickupAddress}

              onChangeText={setPickupAddress}

            />

            <TextInput

              placeholder="Endereço de Entrega"

              placeholderTextColor="#999"

              style={styles.input}

              value={dropoffAddress}

              onChangeText={setDropoffAddress}

            />

            <TouchableOpacity style={styles.button} onPress={handleCreateOrder}>

              <Text style={styles.buttonText}>Salvar Pedido</Text>

            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}>

              <Text style={styles.buttonText}>Cancelar</Text>

            </TouchableOpacity>

          </View>

        </KeyboardAvoidingView>

      </Modal>



    </SafeAreaView>

  );

}



// Estilos

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#0A0F1E' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  dateSelectorContainer: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1A202C' },

  dateButton: { backgroundColor: 'transparent', paddingVertical: 10, marginHorizontal: 5, borderRadius: 8, alignItems: 'center', width: 60 },

  dateButtonSelected: { backgroundColor: '#34D399', borderRadius: 24 },

  dayText: { color: '#A0AEC0', fontSize: 12, marginBottom: 4 },

  dateText: { color: 'white', fontWeight: 'bold', fontSize: 18 },

  selectedText: { color: '#1A202C' },

  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#34D399', borderRadius: 30, elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 },

  // Estilos do Modal

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },

  modalContent: { width: '90%', backgroundColor: '#1A202C', borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },

  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: 'white' },

  input: { width: '100%', backgroundColor: '#2D3748', color: 'white', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },

  button: { backgroundColor: '#34D399', borderRadius: 8, padding: 15, elevation: 2, width: '100%', alignItems: 'center' },

  buttonClose: { backgroundColor: '#EF4444', marginTop: 10 },

  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },

});