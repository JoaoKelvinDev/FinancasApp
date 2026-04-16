import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native'
import { supabase } from '../../service/supabase'

export default function PerfilScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [totalTransacoes, setTotalTransacoes] = useState(0)
  const [totalReceitas, setTotalReceitas] = useState(0)
  const [totalGastos, setTotalGastos] = useState(0)

  useEffect(() => {
    carregarPerfil()
  }, [])

  async function carregarPerfil() {
    setCarregando(true)

    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)

    // Busca resumo geral de todas as transações
    const { data } = await supabase
      .from('transacoes')
      .select('tipo, valor')

    if (data) {
      setTotalTransacoes(data.length)
      let receitas = 0
      let gastos = 0
      data.forEach((t) => {
        if (t.tipo === 'receita') receitas += Number(t.valor)
        else gastos += Number(t.valor)
      })
      setTotalReceitas(receitas)
      setTotalGastos(gastos)
    }

    setCarregando(false)
  }

  async function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut()
          // O AppNavigator redireciona automaticamente pro Login
        },
      },
    ])
  }

  function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatarData(dataStr) {
    return new Date(dataStr).toLocaleDateString('pt-BR')
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    )
  }

  const nome = usuario?.user_metadata?.nome_completo || 'Usuário'
  const email = usuario?.email || ''
  const membroDesde = formatarData(usuario?.created_at)
  const saldo = totalReceitas - totalGastos

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Perfil</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Avatar e nome */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' }}
          style={styles.avatar}
        />
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.membro}>Membro desde {membroDesde}</Text>
      </View>

      {/* Cards de resumo geral */}
      <Text style={styles.secaoTitulo}>Resumo Geral</Text>
      <View style={styles.resumoContainer}>

        <View style={styles.resumoCard}>
          <Text style={styles.resumoValor}>{totalTransacoes}</Text>
          <Text style={styles.resumoLabel}>Transações</Text>
        </View>

        <View style={styles.resumoCard}>
          <Text style={[styles.resumoValor, { color: '#4caf82' }]}>
            {formatarValor(totalReceitas)}
          </Text>
          <Text style={styles.resumoLabel}>Total Receitas</Text>
        </View>

        <View style={styles.resumoCard}>
          <Text style={[styles.resumoValor, { color: '#e05c5c' }]}>
            {formatarValor(totalGastos)}
          </Text>
          <Text style={styles.resumoLabel}>Total Gastos</Text>
        </View>

        <View style={[styles.resumoCard, styles.resumoCardDestaque]}>
          <Text style={[styles.resumoValor, { color: saldo >= 0 ? '#4caf82' : '#e05c5c', fontSize: 20 }]}>
            {formatarValor(saldo)}
          </Text>
          <Text style={styles.resumoLabel}>Saldo Total</Text>
        </View>

      </View>

      {/* Opções */}
      <Text style={styles.secaoTitulo}>Configurações</Text>

      <View style={styles.opcoesContainer}>

        <TouchableOpacity
          style={styles.opcaoItem}
          onPress={() => navigation.navigate('Transacoes')}
        >
          <Text style={styles.opcaoIcone}>📋</Text>
          <Text style={styles.opcaoTexto}>Ver todas as transações</Text>
          <Text style={styles.opcaoSeta}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.opcaoItem}
          onPress={() => navigation.navigate('Adicionar')}
        >
          <Text style={styles.opcaoIcone}>➕</Text>
          <Text style={styles.opcaoTexto}>Nova transação</Text>
          <Text style={styles.opcaoSeta}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.opcaoItem}
          onPress={() => Alert.alert('Informações', `App de Finanças\nVersão 1.0.0\nDesenvolvido com React Native + Supabase\nDesenvolvedor : Joao Kelvin`)}
        >
          <Text style={styles.opcaoIcone}>ℹ️</Text>
          <Text style={styles.opcaoTexto}>Sobre o app</Text>
          <Text style={styles.opcaoSeta}>›</Text>
        </TouchableOpacity>

      </View>

      {/* Botão logout */}
      <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
        <Text style={styles.botaoLogoutTexto}>🚪 Sair da conta</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f0f1a',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0f0f1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  voltar: {
    color: '#6c63ff',
    fontSize: 15,
    width: 60,
  },
  titulo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    tintColor: '#6c63ff',
    marginBottom: 14,
  },
  nome: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  membro: {
    color: '#555',
    fontSize: 12,
  },
  secaoTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resumoContainer: {
    gap: 10,
    marginBottom: 28,
  },
  resumoCard: {
    backgroundColor: '#1e1e2e',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2e2e3e',
  },
  resumoCardDestaque: {
    borderColor: '#6c63ff',
  },
  resumoValor: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resumoLabel: {
    color: '#888',
    fontSize: 13,
  },
  opcoesContainer: {
    backgroundColor: '#1e1e2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2e2e3e',
    marginBottom: 28,
    overflow: 'hidden',
  },
  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2e2e3e',
  },
  opcaoIcone: {
    fontSize: 18,
    marginRight: 12,
  },
  opcaoTexto: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  opcaoSeta: {
    color: '#555',
    fontSize: 20,
  },
  botaoLogout: {
    backgroundColor: '#2a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e05c5c',
  },
  botaoLogoutTexto: {
    color: '#e05c5c',
    fontWeight: 'bold',
    fontSize: 15,
  },
})