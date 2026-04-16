import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { supabase } from '../../service/supabase'

export default function TransacoesScreen({ navigation }) {
  const [transacoes, setTransacoes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarTransacoes()
    const unsubscribe = navigation.addListener('focus', carregarTransacoes)
    return unsubscribe
  }, [navigation])

  async function carregarTransacoes() {
    setCarregando(true)
    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .order('data', { ascending: false })

    if (!error) setTransacoes(data)
    setCarregando(false)
  }

  async function handleExcluir(id) {
    Alert.alert('Excluir', 'Tem certeza que deseja excluir esta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('transacoes').delete().eq('id', id)
          if (!error) carregarTransacoes()
          else Alert.alert('Erro', 'Não foi possível excluir.')
        },
      },
    ])
  }

  function formatarValor(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatarData(dataStr) {
    const [ano, mes, dia] = dataStr.split('-')
    return `${dia}/${mes}/${ano}`
  }

  function renderTransacao({ item }) {
    const isReceita = item.tipo === 'receita'
    return (
      <View style={styles.item}>
        <View style={[styles.icone, { backgroundColor: isReceita ? '#1a3a2a' : '#3a1a1a' }]}>
          <Text style={{ fontSize: 18 }}>{isReceita ? '💰' : '💸'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.descricao}>{item.descricao || item.categoria}</Text>
          <Text style={styles.categoria}>{item.categoria} • {formatarData(item.data)}</Text>
        </View>
        <View style={styles.direita}>
          <Text style={[styles.valor, { color: isReceita ? '#4caf82' : '#e05c5c' }]}>
            {isReceita ? '+' : '-'}{formatarValor(item.valor)}
          </Text>
          <TouchableOpacity onPress={() => handleExcluir(item.id)}>
            <Text style={styles.excluir}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Todas as Transações</Text>
        <View style={{ width: 60 }} />
      </View>

      {transacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Nenhuma transação encontrada.</Text>
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

      {/* Botão adicionar */}
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => navigation.navigate('Adicionar')}
      >
        <Text style={styles.botaoAdicionarTexto}>+ Nova Transação</Text>
      </TouchableOpacity>

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
  loading: {
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e2e',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2e2e3e',
  },
  icone: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  descricao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  categoria: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  direita: {
    alignItems: 'flex-end',
    gap: 4,
  },
  valor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  excluir: {
    fontSize: 16,
  },
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazioTexto: {
    color: '#888',
    fontSize: 15,
  },
  botaoAdicionar: {
    backgroundColor: '#6c63ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  botaoAdicionarTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
})