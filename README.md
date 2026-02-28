# Mini Kanban de Tarefas

Uma aplicação 100% frontend desenvolvida em Angular 21+ com foco em arquitetura moderna e uso de Signals.

## 🚀 Funcionalidades

### Quadro Kanban
- **Três colunas**: A Fazer, Em Progresso, Concluído
- **Drag and Drop**: Mova tarefas entre colunas arrastando
- **Contador de tarefas**: Visualize quantas tarefas há em cada coluna

### Gerenciamento de Tarefas
- **Criar nova tarefa** com título, descrição, priority e status
- **Editar tarefa** existente (clique na tarefa)
- **Excluir tarefa** com confirmação (botão de lixeira)
- **Alterar status** movendo entre colunas ou editando

### Busca e Filtros
- **Campo de busca** por título ou descrição
- **Filtro por priority** (Alta, Média, Baixa)
- **Limpar filtros** para resetar a visualização

### Persistência
- **localStorage**: Dados permanecem após refresh do navegador
- **Estado centralizado**: Gerenciado por service com Signals

## 🛠 Tecnologias Utilizadas

- **Angular 21+** - Framework principal
- **Standalone Components** - Sem NgModules
- **Angular Signals** - Gerenciamento de estado reativo
- **Angular Control Flow** - @if, @for, @switch
- **Reactive Forms** - Formulários com validação
- **Angular CDK** - Drag and Drop
- **TailwindCSS** - Estilização
- **TypeScript** - Linguagem de desenvolvimento

## 🎯 Rotas

- `/board` - Quadro Kanban principal
- `/new` - Criar nova tarefa
- `/task/:id` - Editar tarefa existente

## ⚡ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/pedroMattos/angular-project.git
cd angular-project

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm start
```

### Acesse a aplicação
Abra seu navegador e navegue para `http://localhost:4200/`

## 🔧 Scripts Disponíveis

```bash
# Servidor de desenvolvimento
npm start
```
