# Spotify Stats Dashboard

Uma dashboard interativa que revela seus hábitos musicais com dados reais da API do Spotify.
Visualize suas músicas, artistas e padrões de escuta com uma interface inspirada no próprio Spotify.

![Status Concluído](https://img.shields.io/badge/STATUS-CONCLU%C3%8DDO-brightgreen)

Acesse: https://spotify-app-inky.vercel.app/

---

## Demonstração:

### Login:
<div align="center">
  <img src="https://github.com/user-attachments/assets/992623e3-87b8-4ec3-9aee-61deb53f54c8" width="100%" alt="Spotify App Demo">
</div>

### Dashboard:
<div align="center">
  <img src="https://github.com/user-attachments/assets/97ee92b9-54a0-405d-956b-47d937d4e6da"
width="100%" alt="Spotify App Demo">
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/82c45755-f48c-4581-83c0-20984639b7d1"
width="100%" alt="Spotify App Demo">
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/f079a484-83a1-4f57-b38e-8102e27c53b9"
width="100%" alt="Spotify App Demo">
</div>

## Funcionalidades

- Login com Spotify (OAuth PKCE)
- Top músicas
- Último mês
- Últimos 6 meses
- Todo o período
- Top artistas nos mesmos períodos
- Músicas ouvidas recentemente
- Quantidade de músicas
- Quantidade de artistas
- Interface moderna inspirada no Spotify

---

## Tecnologias

- HTML5
- CSS3 (layout e design custom)
- JavaScript (Vanilla)
- Spotify Web API
- OAuth 2.0 + PKCE (sem backend)

---

## Autenticação

O projeto utiliza o fluxo Authorization Code com PKCE, garantindo:

- Segurança sem expor client_secret
- Funcionamento 100% no frontend
- Tokens armazenados localmente (localStorage)

---

## Limitações

- Não há backend (depende totalmente da API do Spotify)
- Tokens expiram e exigem novo login
- Dados limitados ao escopo autorizado

---

## Como rodar localmente
- clone o projeto
git clone https://github.com/rafaelssant021/spotify-app.git

- entre na pasta
cd spotify-app

- rode com live server ou similar

Exemplo com Live Server (VS Code):

http://127.0.0.1:5500

---

## Configuração obrigatória

No dashboard do Spotify, configure:

Redirect URIs:
http://127.0.0.1:5500/callback.html
https://rafaelssant021.github.io/spotify-app/callback.html

Sem isso, o login não funciona.

## Sobre o projeto

Esse projeto foi construído com foco em:

- Dominar consumo de API real
- Implementar autenticação OAuth corretamente
- Criar uma UI moderna sem frameworks
- Simular um produto real

