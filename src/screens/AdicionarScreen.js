import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { supabase } from '../../service/supabase'

const CATEGORIAS_GASTO = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Outros']
const CATEGORIAS_RECEITA = ['Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros']

export default function AdicionarScreen({ navigation, route }) {
  const tipoInicial = route?.params?.tipo || 'gasto'
  const [tipo, setTipo] = useState(tipoInicial)
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [carregando, setCarregando] = useState(false)

  const categorias = tipo === 'gasto' ? CATEGORIAS_GASTO : CATEGORIAS_RECEITA

  async function handleSalvar() {
    if (!valor || !categoria) {
      Alert.alert('Atenção', 'Preencha o valor e selecione uma categoria!')
      return
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido!')
      return
    }

    setCarregando(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('transacoes').insert({
      user_id: user.id,
      tipo,
      categoria,
      descricao,
      valor: valorNumerico,
      data,
    })

    setCarregando(false)

    if (error) {
      Alert.alert('Erro', 'Não foi possível salvar a transação.')
    } else {
      Alert.alert('Sucesso!', 'Transação salva com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Nova Transação</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Selector tipo */}
      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[styles.tipoBotao, tipo === 'gasto' && styles.tipoGastoAtivo]}
          onPress={() => { setTipo('gasto'); setCategoria('') }}
        >
          <Text style={[styles.tipoTexto, tipo === 'gasto' && { color: '#fff' }]}>💸 Gasto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tipoBotao, tipo === 'receita' && styles.tipoReceitaAtivo]}
          onPress={() => { setTipo('receita'); setCategoria('') }}
        >
          <Text style={[styles.tipoTexto, tipo === 'receita' && { color: '#fff' }]}>💰 Receita</Text>
        </TouchableOpacity>
      </View>

      {/* Valor */}
      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="0,00"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={valor}
        onChangeText={setValor}
      />

      {/* Categoria */}
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.categoriasContainer}>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoriaBotao, categoria === cat && styles.categoriaAtivo]}
            onPress={() => setCategoria(cat)}
          >
            <Text style={[styles.categoriaTexto, categoria === cat && { color: '#fff' }]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Descrição */}
      <Text style={styles.label}>Descrição (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Almoço no restaurante"
        placeholderTextColor="#999"
        value={descricao}
        onChangeText={setDescricao}
      />

      {/* Data */}
      <Text style={styles.label}>Data</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DD"
        placeholderTextColor="#999"
        value={data}
        onChangeText={setData}
      />

      {/* Botão salvar */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: tipo === 'gasto' ? '#e05c5c' : '#4caf82' }]}
        onPress={handleSalvar}
        disabled={carregando}
      >
        {carregando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Salvar Transação</Text>
        }
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
  tipoContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tipoBotao: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tipoGastoAtivo: {
    backgroundColor: '#e05c5c',
  },
  tipoReceitaAtivo: {
    backgroundColor: '#4caf82',
  },
  tipoTexto: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 14,
  },
  label: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#1e1e2e',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2e2e3e',
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoriaBotao: {
    backgroundColor: '#1e1e2e',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2e2e3e',
  },
  categoriaAtivo: {
    backgroundColor: '#6c63ff',
    borderColor: '#6c63ff',
  },
  categoriaTexto: {
    color: '#888',
    fontSize: 13,
  },
  botao: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})