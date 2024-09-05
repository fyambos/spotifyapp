    
# Installation

## Pré requis
Docker

## Set up du projet
`git clone https://github.com/fyambos/spotifyapp`

Dans 'Informations d'identification de sécurité' de AWS créer une clé d'accès et l'exporter dans les variables d'environnement dans un fichier ./.env :
`AWS_ACCESS_KEY_ID=[ip_de_la_cle]`
`AWS_SECRET_ACCESS_KEY=[secret_de_la_cle]`

Dans le tableau de bord de EC2 de AWS créer une paire de clé et l'enregistrer sous ./myKey.pem

Ajouter les droits 700 à launch.sh et clear.sh

`chmod 700 ./launch.sh ./clear.sh`

## Lancement

`sudo ./launch.sh`

## Fermeture

`sudo ./clear.sh`

## Erreur Failed to load plugin schemas
Lancer le premier launch.sh puis le deuxieme et répéter si erreurs

