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
  ScrollView,
} from 'react-native'
import { supabase } from '../../service/supabase'

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos!')
      return
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem!')
      return
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres!')
      return
    }

    setCarregando(true)

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome_completo: nome }, // salva o nome no perfil
      },
    })

    setCarregando(false)

    if (error) {
      Alert.alert('Erro ao cadastrar', error.message)
    } else {
      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada com sucesso. Faça o login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      )
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Logo */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png' }}
        style={styles.logo}
      />

      <Text style={styles.titulo}>Criar Conta</Text>
      <Text style={styles.subtitulo}>É rápido e gratuito</Text>

      {/* Nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
      />

      {/* E-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha (mín. 6 caracteres)"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Confirmar senha */}
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {/* Botão cadastrar */}
      <TouchableOpacity
        style={styles.botao}
        onPress={handleCadastro}
        disabled={carregando}
      >
        {carregando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Cadastrar</Text>
        }
      </TouchableOpacity>

      {/* Voltar pro login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkTexto}>
          Já tem conta? <Text style={styles.linkDestaque}>Fazer login</Text>
        </Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 14,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
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