# Arquitetura do Tinder com Redis e NodeJS
Esse projeto é uma prova de conceito que exemplifica o quão fácil é criar a arquitetura do Tinder
para os seguinte cenários:
- Um usuário logado (eu/me/você)
- Adicionar usuários com respectiva geolocalização
- Mostrar usuários com mais próximos a mim
- Setar usuários com likes e deslikes
- Não exibir usuários com likes/deslikes

# Arquitetura do Tinder com Redis
- `setup` Inicializa o app limpando e setando as infos defaults dos usuários
  - `redis.flushAll()` Faz flush para limpar/zerar o redis
  - `client.set('me')` Adiciona meu usuário 
  - `client.set('1...')` Adiciona demais usuários
  - `geoAdd('feed',{latitude: lat, longitude: lon, member: '1'})` Adiciona usuários a um feed global de geolocalização

- `getUsers` Faz os cálculos para pegar usuários próximos descondierandos likes/deslikes
  - `lookup` Cria um feed para cada usuário
    - `geoSearchStore('feed_me','feed',{latitude:lat,longitude:lon},{radius: 50000, unit: 'km'})` Armazena os usuários do mais perto para o mais longe em um feed temporário
    - `zDiffStore(key,['feed_me','usersmatch_me'])` Sobreescreve o feed temporário apenas com usuários que não houve iteração de likes/deslikes
    - `zRange('feed_me', 0, -1)` Pega todos os usuários que restaram no feed

- `getDislikes` Pega todos os usuários que receberam dislikes

- `getLikes` Pega todos os usuários que receberam likes

- `setLike` Set no usuário que recebeu o like
  - `zAdd('usersmatch_me')` Adiciona ao feed de iteração do usuario
  - `zAdd('usersdislike_me')` Adiciona ao feed de dislike do usuário

- `setDislike` Set no usuário que recebeu dislike
  - `zAdd('usersmatch_me',{score:1, value:id},{INCR:true})` Adiciona ao feed de iteração do usuario
  - `zAdd('usersdislike_me',{score:1, value:id},{INCR:true})` Adiciona ao feed de dislike do usuário
 
# Screenshots
<img width="1440" alt="Screen Shot 2022-08-04 at 00 05 17" src="https://user-images.githubusercontent.com/3135444/182754324-d8e2e5c1-c1a3-43c0-a959-b2cd5ce49750.png">


# REDIS CONFIG
Você pode substituir URL do redis ou usar a URL compartilhada desse projeto

# executar servidor
`yarn server`

# executar reactjs
`yarn start` 
