import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons'; // Biblioteca de ícones

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Oculta o título no topo de cada tela
        tabBarActiveTintColor: '#34D399', // Cor do ícone ativo (verde menta)
        tabBarInactiveTintColor: '#A0AEC0', // Cor do ícone inativo (cinza)
        tabBarStyle: {
          backgroundColor: '#1A202C', // Cor de fundo da barra de abas
          borderTopWidth: 0, // Remove a linha superior
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dash',
          tabBarIcon: ({ color }) => <FontAwesome5 name="tachometer-alt" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <FontAwesome5 name="box" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="details/[id]" 
        options={{
          title: 'Details',
          tabBarIcon: ({ color }) => <FontAwesome5 name="info-circle" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="account" 
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}