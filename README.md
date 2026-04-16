# 💰 Finanças App

Aplicativo mobile de gerenciamento de finanças pessoais desenvolvido com React Native + Expo + Supabase.

---

## 👨‍💻 Integrante

| Nome | Componentes Desenvolvidos |
|------|--------------------------|
| Joao Kelvin B Novais / Matricula : 01826654
| Login, Cadastro, Dashboard, Adicionar Transação, Lista de Transações, Perfil, Navegação, Integração Supabase |

---

## 📱 Telas do Aplicativo

| Tela | Descrição |
|------|-----------|
| Login | Autenticação do usuário via Supabase Auth |
| Cadastro | Criação de nova conta com nome, e-mail e senha |
| Dashboard | Saldo do mês, resumo de receitas/gastos e transações recentes |
| Adicionar Transação | Formulário para registrar receitas ou gastos com categoria |
| Lista de Transações | Histórico completo com opção de exclusão |
| Perfil | Dados do usuário, resumo geral e logout |

---

## ⚙️ Componentes React Native Utilizados

- **View** — estrutura de layout de todas as telas
- **Text** — exibição de títulos, valores e informações
- **TextInput** — campos de entrada (e-mail, senha, valor, descrição)
- **TouchableOpacity** — botões interativos em todas as telas
- **FlatList** — listagem de transações no Dashboard e na tela de Transações
- **Image** — logo do app e avatar do usuário
- **ScrollView** — rolagem nas telas de Cadastro, Adicionar e Perfil
- **ActivityIndicator** — feedback visual de carregamento
- **Flexbox** — layout responsivo em todas as telas
- **Navegação entre telas** — React Navigation (Stack Navigator)

---

## 🗄️ Banco de Dados

- **Supabase** (PostgreSQL na nuvem)
- Autenticação de usuários via Supabase Auth
- Tabela `transacoes` com Row Level Security (cada usuário vê só seus dados)

---

## 🚀 Como Instalar e Rodar

### Pré-requisitos
- Node.js instalado
- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/FinancasApp.git
cd FinancasApp
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_do_supabase
```

**4. Rode o projeto**
```bash
npx expo start
```

**5. Abra no celular**

Escaneie o QR Code com o app **Expo Go** no celular.

---

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Supabase](https://supabase.com/)
- [React Navigation](https://reactnavigation.org/)