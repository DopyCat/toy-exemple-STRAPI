# Tutorial Completo: NGINX como API Gateway

## Sumário

1. [Pré-requisitos](#pré-requisitos)
2. [Baixar e instalar o NGINX no Windows](#1-baixar-e-instalar-o-nginx-no-windows)
3. [Configurar o NGINX como API Gateway](#2-configurar-o-nginx-como-api-gateway)
4. [Ajustar o Strapi para funcionar atrás do Gateway](#3-ajustar-o-strapi)
5. [Ajustar o Next.js para usar o Gateway](#4-ajustar-o-nextjs)
6. [Comandos essenciais do NGINX](#5-comandos-essenciais-do-nginx)
7. [Scripts automáticos para facilitar sua vida](#6-scripts-automáticos-opcional)

---

## Pré-requisitos

Antes de começar, certifique-se de que:

- ✅ Seu projeto Next.js está rodando em `http://localhost:3000`
- ✅ Seu projeto Strapi está rodando em `http://localhost:1337`
- ✅ Você tem acesso ao terminal (PowerShell) no Windows

---

## 1. Baixar e instalar o NGINX no Windows

### Passo 1: Download

1. Acesse [nginx.org/en/download.html](https://nginx.org/en/download.html)
2. Baixe a versão **Stable** (ex: `nginx-1.24.0.zip`)
3. Escolha a versão Windows (geralmente é um arquivo `.zip`)

### Passo 2: Extrair

1. Extraia o arquivo `.zip` para uma pasta de fácil acesso, por exemplo:
   - `C:\nginx` (recomendado)
   - Ou deixe em `Downloads\nginx-1.24.0`

### Passo 3: Estrutura de pastas

Após extrair, sua pasta do NGINX deve ter esta estrutura:

```
C:\nginx\
├── conf\
│   └── nginx.conf          ← Arquivo de configuração (vamos editar)
├── html\
├── logs\
└── nginx.exe               ← Executável principal
```

---

## 2. Configurar o NGINX como API Gateway

### Passo 1: Abrir o arquivo de configuração

1. Navegue até `C:\nginx\conf\`
2. Abra o arquivo `nginx.conf` com o VS Code ou Bloco de Notas

### Passo 2: Substituir pelo conteúdo correto

**APAGUE TODO O CONTEÚDO** e cole exatamente isto:

```nginx
# Configuração do API Gateway
events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        # Rota 1: Frontend Next.js
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Rota 2: Strapi CMS (Painel Admin + API)
        location /cms/ {
            proxy_pass http://localhost:1337/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Rota 3: Uploads de imagens do Strapi
        location /uploads/ {
            proxy_pass http://localhost:1337/uploads/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Rota 4: Sua API própria (opcional)
        location /api/v1/ {
            rewrite ^/api/v1/(.*)$ /$1 break;
            proxy_pass http://localhost:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Passo 3: Salvar o arquivo

- Pressione `Ctrl+S` para salvar
- Feche o editor

---

## 3. Ajustar o Strapi para funcionar atrás do Gateway

### Passo 1: Configurar o server.ts do Strapi

1. No seu projeto Strapi, abra `config/server.ts`
2. Altere para:

```typescript
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: '/cms',  // ← LINHA IMPORTANTE!
  app: {
    keys: env.array('APP_KEYS'),
  },
});
```

### Passo 2: Limpar e reconstruir o Strapi

No terminal do Strapi:

```bash
# Derrube o servidor atual (Ctrl+C)
# Depois recompile:
npm run build

# Inicie novamente:
npm run develop
```

---

## 4. Ajustar o Next.js para usar o Gateway

### Passo 1: Configurar variáveis de ambiente

No seu projeto Next.js, abra `.env.local` e altere:

```env
# Mudar de http://localhost:1337 para:
NEXT_PUBLIC_STRAPI_URL=http://localhost
```

### Passo 2: Configurar o next.config.ts

Abra `next.config.ts` e altere:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/uploads/**",  // Libera as imagens do Strapi
      },
    ],
  },
};

export default nextConfig;
```

### Passo 3: Ajustar as chamadas de API no seu código

No seu `app/page.tsx`, altere os `fetch`:

```typescript
// ANTES:
// fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=*`)

// DEPOIS (correto):
fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/cms/api/articles?populate=*`)

// Para as imagens, use APENAS o caminho relativo:
<Image
  src={article.cover.url}  // ← Isso já vem como "/uploads/foto.jpg"
  alt={article.title}
  fill
  unoptimized  // ← Para o Next.js não tentar otimizar
/>
```

## 5. Comandos essenciais do NGINX

### No PowerShell (seu terminal principal)

| Ação | Comando |
|------|---------|
| **Ligar NGINX** | `start .\nginx` |
| **Testar configuração** | `.\nginx -t` |
| **Recarregar configuração** | `.\nginx -s reload` |
| **Desligar NGINX** | `.\nginx -s stop` |
| **Matar NGINX à força** | `Stop-Process -Name "nginx" -Force` |

### Script completo de restart

Salve como `restart-nginx.ps1`:

```powershell
# restart-nginx.ps1
Write-Host "🔄 Reiniciando NGINX..." -ForegroundColor Yellow

# Parar NGINX
Stop-Process -Name "nginx" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Iniciar NGINX
Set-Location C:\nginx
start .\nginx

# Testar se funcionou
.\nginx -t

Write-Host "✅ NGINX reiniciado!" -ForegroundColor Green
Write-Host "📍 Acesse: http://localhost" -ForegroundColor Cyan
```

---

## 6. Scripts automáticos (opcional)

### Script para iniciar tudo de uma vez

Salve como `start-all.ps1`:

```powershell
# start-all.ps1
Write-Host "🚀 Iniciando todos os serviços..." -ForegroundColor Yellow

# 1. Iniciar NGINX
Set-Location C:\nginx
start .\nginx
Write-Host "✅ NGINX iniciado" -ForegroundColor Green

# 2. Iniciar Strapi (assumindo que está na pasta correta)
Set-Location C:\caminho\do\seu\strapi
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run develop"
Write-Host "✅ Strapi iniciando..." -ForegroundColor Green

# 3. Iniciar Next.js
Set-Location C:\caminho\do\seu\nextjs
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Write-Host "✅ Next.js iniciando..." -ForegroundColor Green

Write-Host "`n📍 Acesse: http://localhost" -ForegroundColor Cyan
Write-Host "📍 Painel Strapi: http://localhost/cms/admin" -ForegroundColor Cyan
```

### Script para parar tudo

Salve como `stop-all.ps1`:

```powershell
# stop-all.ps1
Write-Host "🛑 Parando todos os serviços..." -ForegroundColor Yellow

# Parar NGINX
Stop-Process -Name "nginx" -Force -ErrorAction SilentlyContinue
Write-Host "✅ NGINX parado" -ForegroundColor Green

# Parar Node (Strapi + Next.js)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Node.js parado" -ForegroundColor Green

Write-Host "🎉 Todos os serviços foram parados!" -ForegroundColor Green
```

---

## Teste Final

Após seguir todos os passos:

1. **Abra o navegador em:** `http://localhost`
   - ✅ Deve mostrar seu Next.js

2. **Acesse:** `http://localhost/cms/admin`
   - ✅ Deve abrir o painel do Strapi

3. **Teste a API:** `http://localhost/cms/api/articles`
   - ✅ Deve retornar o JSON dos artigos

4. **Verifique as imagens:**
   - ✅ As fotos dos artigos devem aparecer na página

---

## Problemas comuns e soluções

**"Welcome to nginx" aparece**
O NGINX não leu seu arquivo de configuração. Execute:
```powershell
Stop-Process -Name "nginx" -Force
start .\nginx
```

**"Bad Request" nas imagens**
Adicione `unoptimized` na tag `<Image>` do Next.js.

**404 no Strapi**
Verifique se o `server.ts` do Strapi tem `url: '/cms'`.

**"Porta 80 ocupada"**
Descubra qual programa está usando:
```powershell
netstat -ano | findstr :80
```
Depois mate o processo com o PID mostrado.

---

## ✅ Checklist de verificação

- [ ] NGINX está rodando (`http://localhost` mostra seu app)
- [ ] Strapi tem `url: '/cms'` no `server.ts`
- [ ] Next.js tem `.env.local` com `NEXT_PUBLIC_STRAPI_URL=http://localhost`
- [ ] Next.js tem `next.config.ts` com permissão para `/uploads/**`
- [ ] As chamadas `fetch` usam `/cms/api/...`
- [ ] As imagens usam `unoptimized` e `src={article.cover.url}`
