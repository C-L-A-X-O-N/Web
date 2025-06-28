# CLAXON

## Production

Lancement du serveur web via docker: 

1. Créer un fichier config.json pour y modifier le lien vers le websocket
2. Lancer la commande: 
```bash
docker run -p 80:80 -v ./config.json:/usr/share/nginx/html/config.json ghcr.io/c-l-a-x-o-n/web/prod
```

## Développement

Lancement du projet: 

```bash
npm install

npm run dev
```
