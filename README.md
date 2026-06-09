# Toy Example - Site TD com Strapi, Next.js e NGINX

## Integrantes

- Agni Sofia
- Letícia
- Pedro Axer

## Proposta do projeto

Este repositório reúne um toy example para validar a proposta do site-td como um agregador de conteúdos. A ideia é entender, de forma simples e reproduzível, como o front-end pode consumir informações vindas de diferentes origens, como APIs da PUC Minas e um CMS baseado em Strapi.

O fluxo que estamos testando neste exemplo é:

1. O conteúdo é cadastrado e publicado no Strapi.
2. O Next.js consome as informações do Strapi.
3. O NGINX atua como API Gateway e faz o redirecionamento do tráfego.
4. No futuro, esse mesmo gateway pode encaminhar requisições para outros backends além do Strapi.

Este ambiente foi pensado para servir como base de estudo e validação antes de evoluir para a implementação do projeto principal.

## Stack utilizada

- Next.js para o front-end
- Strapi para o CMS/backend de conteúdo
- NGINX como API Gateway/reverse proxy
- Docker e Docker Compose para subir tudo de forma local

## Arquitetura

- `/` atende o front-end em Next.js
- `/cms/` expõe o painel administrativo e as rotas da API do Strapi
- `/uploads/` expõe os arquivos enviados pelo Strapi
- O gateway já deixa preparado um caminho para um futuro backend em `/api/v1/`

## Como rodar o projeto

### Pré-requisitos

- Docker
- Docker Compose

### Subir a aplicação

Na raiz do repositório, execute:

```bash
docker compose up --build
```

Depois disso, acesse:

- Front-end: http://localhost
- Strapi Admin: http://localhost/cms/admin

### Primeiro acesso ao Strapi

Se você ainda não tiver uma conta no Strapi, crie uma conta no primeiro acesso ao painel administrativo.

Depois de entrar no admin, é necessário cadastrar e publicar o conteúdo do tipo `Article`, porque o Next.js depende desses dados para renderizar a aplicação.

### Deixar a API pública

Por padrão, o Strapi bloqueia o acesso público às rotas. Se essa permissão não for ajustada, o Next.js pode falhar ao buscar os dados.

Faça o seguinte no painel do Strapi:

1. Clique na engrenagem no canto inferior esquerdo.
2. Entre em `Settings`.
3. Abra `Roles`.
4. Selecione `Public`.
5. Abra a permissão do conteúdo `Article`.
6. Marque as opções `find` e `find one`.
7. Salve as alterações.

Sem isso, o front-end não consegue ler os artigos publicamente.

## Tarefas propostas

As próximas etapas pensadas para esse toy example são:

1. Integrar Strapi com Next.
2. Integrar Strapi com Next e outro backend.
3. Integrar Strapi com Next e outro backend por meio de API Gateway (NGINX).
4. Construir container Docker para integrar Strapi com Next e outro backend por meio de API Gateway (NGINX).

## Observações importantes

- O backend do Strapi usa banco SQLite local para facilitar a execução do exemplo.
- O NGINX já está configurado como ponto central de entrada da aplicação.
- Este projeto serve como base para experimentar a comunicação entre front-end, CMS e futuros serviços adicionais.

## Referência

O objetivo segue a linha da integração Strapi + Next.js proposta pela documentação oficial:

https://strapi.io/integrations/nextjs-cms