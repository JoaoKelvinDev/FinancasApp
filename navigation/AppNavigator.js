import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { View, ActivityIndicator } from 'react-native'

import { supabase } from '../service/supabase'

import LoginScreen from '../src/screens/LoginScreen'
import CadastroScreen from '../src/screens/CadastroScreen'
import DashboardScreen from '../src/screens/DashboardScreen'
import TransacoesScreen from '../src/screens/TransacoesScreen'
import AdicionarScreen from '../src/screens/AdicionarScreen'
import PerfilScreen from '../src/screens/PerfilScreen'

const Stack = createStackNavigator()

export default function AppNavigator() {
  const [sessao, setSessao] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Verifica se já tem sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session)
      setCarregando(false)
    })

    // Fica escutando mudanças de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSessao(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0f0f1a' }}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {sessao ? (
          // Usuário logado → telas principais
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Transacoes" component={TransacoesScreen} />
            <Stack.Screen name="Adicionar" component={AdicionarScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
          </>
        ) : (
          // Usuário não logado → telas de auth
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}