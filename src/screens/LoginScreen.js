import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { supabase } from '../../service/supabase'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha!')
      return
    }

    setCarregando(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    setCarregando(false)

    if (error) {
      Alert.alert('Erro ao entrar', error.message)
    }
    // Se login OK, o AppNavigator redireciona automaticamente
  }

  return (
    <View style={styles.container}>

      {/* Logo / Imagem do app */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png' }}
        style={styles.logo}
      />

      <Text style={styles.titulo}>Finanças App</Text>
      <Text style={styles.subtitulo}>Controle seus gastos com facilidade</Text>

      {/* Campo e-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão entrar */}
      <TouchableOpacity
        style={styles.botao}
        onPress={handleLogin}
        disabled={carregando}
      >
        {carregando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Entrar</Text>
        }
      </TouchableOpacity>

      {/* Link para cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.linkTexto}>
          Não tem conta? <Text style={styles.linkDestaque}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginBottom: 36,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#1e1e2e',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2e2e3e',
  },
  botao: {
    width: '100%',
    backgroundColor: '#6c63ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkTexto: {
    color: '#888',
    fontSize: 14,
  },
  linkDestaque: {
    color: '#6c63ff',
    fontWeight: 'bold',
  },
})