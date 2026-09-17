# PIM III — UNIP: Ceregati E-Logística

Projeto Integrado Multidisciplinar III para o Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas (UNIP).

## Sobre a Empresa Fictícia
A **Ceregati E-Logística** é uma transportadora focada em operações de transferência rodoviária e distribuição last-mile para o comércio eletrônico.

## Disciplinas Integradas
- **Redes de Computadores e Sistemas Distribuídos**: Infraestrutura com VLANs, roteamento inter-VLAN e microsserviços.
- **Pesquisa, Tecnologia e Inovação**: Metodologia científica e fundamentação da arquitetura distribuída.
- **Direitos Humanos**: Acessibilidade (WCAG) e proteção de dados (LGPD).

## Estrutura do Repositório

- `/docs`: Documentação acadêmica e diagramas técnicos.

- `/network`: Arquivos de topologia e scripts de switches e roteadores.

- `/backend`: API RESTful em Node.js com TypeScript e Docker.

- `/frontend`: Interface administrativa e de rastreamento em React.

## Como Executar o Projeto
- Clone o repositório:

git clone https://github.com/rafaelfujiy/ceregati-elogistica-pim3.git

- Inicie o Banco de Dados Isolado (Docker):

cd backend
docker-compose up -d

- Execute a API RESTful:

npm install
npm run dev

- Inicie a Aplicação Web:

cd ../frontend
npm install
npm run dev
