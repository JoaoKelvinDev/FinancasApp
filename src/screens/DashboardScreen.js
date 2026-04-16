import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native'
import { supabase } from '../../service/supabase'

export default function DashboardScreen({ navigation }) {
  const [transacoes, setTransacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [saldo, setSaldo] = useState(0)
  const [totalReceitas, setTotalReceitas] = useState(0)
  const [totalGastos, setTotalGastos] = useState(0)

  useEffect(() => {
    carregarDados()

    // Atualiza a tela toda vez que voltar pra ela
    const unsubscribe = navigation.addListener('focus', carregarDados)
    return unsubscribe
  }, [navigation])

  async function carregarDados() {
    setCarregando(true)

    // Pega o usuário logado
    const { data: { user } } = await supabase.auth.getUser()
    const nome = user?.user_metadata?.nome_completo || user?.email || 'Usuário'
    setNomeUsuario(nome.split(' ')[0]) // só o primeiro nome

    // Pega as transações do mês atual
    const hoje = new Date()
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      .toISOString().split('T')[0]
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
      .toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .gte('data', primeiroDia)
      .lte('data', ultimoDia)
      .order('data', { ascending: false })

    if (!error && data) {
      setTransacoes(data)

      // Calcula saldo, receitas e gastos
      let receitas = 0
      let gastos = 0
      data.forEach((t) => {
        if (t.tipo === 'receita') receitas += Number(t.valor)
        else gastos += Number(t.valor)
      })
      setTotalReceitas(receitas)
      setTotalGastos(gastos)
      setSaldo(receitas - gastos)
    }

    setCarregando(false)
  }

  function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatarData(dataStr) {
    const [ano, mes, dia] = dataStr.split('-')
    return `${dia}/${mes}`
  }

  function renderTransacao({ item }) {
    const isReceita = item.tipo === 'receita'
    return (
      <View style={styles.transacaoItem}>
        <View style={[styles.transacaoIcone, { backgroundColor: isReceita ? '#1a3a2a' : '#3a1a1a' }]}>
          <Text style={{ fontSize: 18 }}>{isReceita ? '💰' : '💸'}</Text>
        </View>
        <View style={styles.transacaoInfo}>
          <Text style={styles.transacaoDescricao}>{item.descricao || item.categoria}</Text>
          <Text style={styles.transacaoCategoria}>{item.categoria} • {formatarData(item.data)}</Text>
        </View>
        <Text style={[styles.transacaoValor, { color: isReceita ? '#4caf82' : '#e05c5c' }]}>
          {isReceita ? '+' : '-'}{formatarValor(Number(item.valor))}
        </Text>
      </View>
    )
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.boasVindas}>Olá, {nomeUsuario} 👋</Text>
          <Text style={styles.mesAtual}>
            {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' }}
            style={styles.avatarImg}
          />
        </TouchableOpacity>
      </View>

      {/* Card de saldo */}
      <View style={styles.cardSaldo}>
        <Text style={styles.cardSaldoLabel}>Saldo do mês</Text>
        <Text style={[styles.cardSaldoValor, { color: saldo >= 0 ? '#4caf82' : '#e05c5c' }]}>
          {formatarValor(saldo)}
        </Text>
        <View style={styles.cardResumo}>
          <View style={styles.cardResumoItem}>
            <Text style={styles.cardResumoLabel}>💰 Receitas</Text>
            <Text style={[styles.cardResumoValor, { color: '#4caf82' }]}>
              {formatarValor(totalReceitas)}
            </Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.cardResumoItem}>
            <Text style={styles.cardResumoLabel}>💸 Gastos</Text>
            <Text style={[styles.cardResumoValor, { color: '#e05c5c' }]}>
              {formatarValor(totalGastos)}
            </Text>
          </View>
        </View>
      </View>

      {/* Botões de ação */}
      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={[styles.botaoAcao, { backgroundColor: '#4caf82' }]}
          onPress={() => navigation.navigate('Adicionar', { tipo: 'receita' })}
        >
          <Text style={styles.botaoAcaoTexto}>+ Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoAcao, { backgroundColor: '#e05c5c' }]}
          onPress={() => navigation.navigate('Adicionar', { tipo: 'gasto' })}
        >
          <Text style={styles.botaoAcaoTexto}>- Gasto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoAcao, { backgroundColor: '#6c63ff' }]}
          onPress={() => navigation.navigate('Transacoes')}
        >
          <Text style={styles.botaoAcaoTexto}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de transações recentes */}
      <Text style={styles.secaoTitulo}>Transações do mês</Text>

      {transacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Nenhuma transação este mês.</Text>
          <Text style={styles.vazioSubtexto}>Toque em "+ Receita" ou "- Gasto" para começar!</Text>
        </View>
      ) : (
        <FlatList
          data={transacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderTransacao}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0f0f1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  boasVindas: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  mesAtual: {
    fontSize: 13,
    color: '#888',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    tintColor: '#6c63ff',
  },
  cardSaldo: {
    backgroundColor: '#1e1e2e',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2e2e3e',
  },
  cardSaldoLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 6,
  },
  cardSaldoValor: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardResumo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cardResumoItem: {
    alignItems: 'center',
  },
  cardResumoLabel: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
  },
  cardResumoValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divisor: {
    width: 1,
    height: 40,
    backgroundColor: '#2e2e3e',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  botaoAcao: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoAcaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  secaoTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transacaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e2e',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2e2e3e',
  },
  transacaoIcone: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transacaoInfo: {
    flex: 1,
  },
  transacaoDescricao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transacaoCategoria: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  transacaoValor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazioTexto: {
    color: '#888',
    fontSize: 15,
    marginBottom: 6,
  },
  vazioSubtexto: {
    color: '#555',
    fontSize: 13,
    textAlign: 'center',
  },
})