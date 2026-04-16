# Spotify Stats Dashboard

Uma dashboard interativa que revela seus hábitos musicais com dados reais da API do Spotify.
Visualize suas músicas, artistas e padrões de escuta com uma interface inspirada no próprio Spotify.

Acesse: https://rafaelssant021.github.io/spotify-app/

---

## Funcionalidades

- Login com Spotify (OAuth PKCE)
- Top músicas:
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

## Sobre o projeto

Esse projeto foi construído com foco em:

- Dominar consumo de API real
- Implementar autenticação OAuth corretamente
- Criar uma UI moderna sem frameworks
- Simular um produto real

