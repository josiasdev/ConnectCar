<h1 align="center">ConnectCar</h1>

<p align="center">
    <img src="./ConnectCar-app//assets/Logo/logo.png" alt="Logo do ConnectCar" width="150">
</p>
Uma solução móvel para conectar pessoas que precisam enviar objetos a caminhoneiros com espaço de sobra em suas rotas, otimizando o transporte e criando novas oportunidades.

## Sobre o Projeto

Você já pensou em quantas viagens de caminhão acontecem todos os dias com espaço ocioso na carroceria? O ConnectCar nasceu da ideia de aproveitar esse espaço. O aplicativo busca ser uma ponte entre quem precisa enviar um item seja um móvel pequeno, uma caixa ou um produto.

Para o remetente, é uma forma mais econômica e flexível de transporte. Para o motorista, é uma oportunidade de gerar uma renda extra com um percurso que ele já faria. É uma ideia simples, baseada em economia compartilhada e na otimização de recursos.

## Status Atual

Este projeto está atualmente em fase de prototipagem e desenvolvimento. As funcionalidades básicas de interface e de banco de dados local estão sendo construídas como prova de conceito.

## Funcionalidades

Atualmente, o foco está na estrutura principal do aplicativo.

#### Implementadas:
* **Cadastro e Login de Usuários:** Sistema completo para criar uma conta e autenticar, com todos os dados salvos localmente no dispositivo usando SQLite.
* **Estrutura de Navegação:** Navegação principal do aplicativo construída com Expo Router, incluindo o fluxo de autenticação e as telas principais.
* **Interface Responsiva:** As telas se adaptam para evitar que o teclado cubra os campos de texto, garantindo uma boa experiência de uso.

#### Planejadas:
* Busca de rotas por origem e destino.
* Cadastro de rotas disponíveis pelos motoristas.
* Perfil de usuário para remetentes e motoristas.
* Sistema de chat para comunicação entre as partes.
* Sistema de avaliação e feedback.

## Tecnologias Utilizadas

Este projeto foi construído com uma stack moderna, focada em uma ótima experiência tanto para o desenvolvedor quanto para o usuário final.

* **Base:** React Native com Expo
* **Linguagem:** TypeScript
* **Navegação:** Roteamento baseado em arquivos com Expo Router
* **Estilização:** Tailwind CSS (através da biblioteca `twrnc`)
* **Banco de Dados Local:** Expo SQLite
* **Animação e Gestos:** React Native Reanimated e Gesture Handler

## Como Começar

Se você quiser rodar este projeto localmente, siga os passos abaixo.

**Pré-requisitos:**
* Node.js (versão LTS recomendada)
* Git
* Um celular com o app Expo Go ou um emulador Android/iOS configurado

**Instalação:**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/josiasdev/ConnectCar.git
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd ConnectCar-app
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Execute o projeto:**
    ```bash
    npx expo start
    ```
    Isso iniciará o servidor de desenvolvimento do Expo. Você pode então escanear o QR Code com o aplicativo Expo Go no seu celular para abrir o ConnectCar.

## Estrutura de Pastas

A organização do projeto busca separar as responsabilidades de forma clara:

* `app/`: Contém todos os arquivos de rota, gerenciados pelo Expo Router.
* `components/`: Onde ficam os componentes reutilizáveis (botões, inputs, telas completas como LoginScreen, etc.).
* `services/`: Para a lógica que não é diretamente visual, como as funções de interação com o banco de dados.
* `assets/`: Para arquivos estáticos como fontes, imagens e ícones.
