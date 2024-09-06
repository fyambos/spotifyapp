    
# Installation

## Pré requis
Docker

## Set up du projet
`git clone https://github.com/fyambos/spotifyapp`

Dans 'Informations d'identification de sécurité' de AWS créer une clé d'accès et l'exporter dans les variables d'environnement dans un fichier ./.env :
`AWS_ACCESS_KEY_ID=[ip_de_la_cle]`
`AWS_SECRET_ACCESS_KEY=[secret_de_la_cle]`

Dans le tableau de bord de EC2 de AWS créer une paire de clé et l'enregistrer sous ./myKey.pem

Ajouter les droits 700 à launch.sh, launch2.sh et clear.sh

`chmod 700 ./launch.sh ./clear.sh`

## Lancement

`sudo ./launch.sh`
`sudo ./launch2.sh`

> Si erreur, faites les commandes suivantes:
`sudo docker compose -f /root/spotifyapp/docker-compose.yml up`
`ssh -i myKey.pem ubuntu@[ip_instance]`

## Fermeture

`sudo ./clear.sh`

# Documentation

Partie Docker
Création du Dockerfile pour le backend
```
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "start" ]
```

Création du Dockerfile pour le front end
Note: par défaut il se lance sur le port 3000 donc on utilise ENV
```
FROM node:20-alpine
ENV PORT=4000
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "run", "start" ]
```

On spécifie les points d’entrée du Dockerfile dans le fichier yml, soit backend et frontend qui sont les dossier de notre projet contenant le Dockerfile
```
services:
  frontend:
    build: ./frontend
    ports:
      - "4000:4000"
    networks:
      - mynetwork
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    networks:
      - mynetwork
networks:
  mynetwork:
    driver: bridge
```


Partie AWS
On crée une instance sur AWS dont on récupère le AMI, puis on génère une clé d’accès afin de le fournir dans le fichier terraform.
Pour cela sur docker, on récupère l’image terraform/hashicorp
Le fichier terraform :
```
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.2.0"
    }
  }
  required_version = ">= 1.2.0"
}
```
On spécifie la région:
```
provider "aws" {
  region = "us-east-1"
}
```

On fournit l’AMI recupéré précédemment ainsi que un fichier de clé RSA privée, ici nommée myKey
```
resource "aws_instance" "spotifyapp" {
  count = 1
  ami           = "ami-0e86e20dae9224db8"
  instance_type = "t2.micro"
  key_name      = "myKey"
  vpc_security_group_ids = [aws_security_group.spotifyapp_sg.id]


}
```
Par défaut l’écoute se fait sur le port 22, en ssh, pour communiquer avec l’application frontend on doit y ajouter le port, ici 4000
```
resource "aws_security_group" "spotifyapp_sg" {
    name        = "spotifyapp"
    description = "Allow inbound traffic"
    ingress {
        from_port   = 4000
        to_port     = 4000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}
```
Pour le traffic sortant on accepte tout (0)
```
docker container run -it --rm -v $PWD/terraform:$PWD/terraform -w $PWD/terraform -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY hashicorp/terraform init
```

Afin de lancer terraform on lance la commande suivante, suivie de init pour initialiser, plan pour voir le retour de la commande et enfin apply pour réaliser la commande. On peut voir sur aws que l’instance s’est bien lancée.

Afin de pouvoir utiliser ansible on a besoin de récupérer la sortie du apply. Dans notre cas c’est l’ip de l’instance AWS. Dans le fichier terraform on ajoute:
```
output "app_server_public_ip" {
  value = aws_instance.spotifyapp[*].public_ip
}
```
On modifie notre commande plan en y ajoutant -out=terraform.tfplan
Et on modifie notre commande apply en y ajoutant -auto-approve terraform.tfplan
Enfin, on ajoute la commande output:
```
docker container run -it --rm -v $PWD/terraform:$PWD/terraform -w $PWD/terraform hashicorp/terraform output -json > outputs.json
```

Partie Ansible
On crée un fichier ansible.cfg et un fichier playbook.yml dans un dossier playbook, ainsi que un Dockerfile dans ansible.

Contenu du ansible.cfg:
```
[default]
host_key_checking = False
inventory = inventory.ini
ansible_ssh_common_args = -o StrictHostKeyChecking=no
```
Dans le Docker file on récupère une instance python pour pouvoir utiliser ansible
```
FROM python:3.7-slim
RUN pip install ansible
COPY ./playbook ./playbook
WORKDIR /playbook
CMD ["pwd"]
```
Dans nos commande de lancement, avant de lancer l’instance on copie notre application backend et frontend dans le dossier playbook, ainsi que la clé RSA et le docker-compose associé à notre frontend et backend
```
cp myKey.pem ansible/playbook
cp -r backend ansible/playbook
cp -r frontend ansible/playbook
cp docker-compose.yml ansible/playbook
```
Note: le fichier de lancement se nomme launch.sh

Dans le playbook.yml on configure le server, puis on clone le répo git, on installe docker afin d’utiliser docker compose up -d

Dans l’inventory.ini on ajoute [default]
Puis on ajoute dans le launch.sh la commande suivante qui permet de récupérer les ip et de les metre dans l’inventory.
```
ips=$(jq -r '.app_server_public_ip.value[]' tmp/output.json)
echo "[default]" > ansible/playbook/inventory.ini
for ip in $ips; do
  echo "$ip ansible_user=ubuntu ansible_ssh_private_key_file=myKey.pem" >> ansible/playbook/inventory.ini
done
```
Puis ces commandes afin de donner les droits à la clé d’accès et de build et run le conteneur ansible
```
chmod 400 ansible/playbook/myKey.pem
docker build -t ansible ./ansible
docker container run -it --rm ansible ansible-playbook -i inventory.ini playbook.yml
```

