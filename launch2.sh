chmod 400 ansible/playbook/myKey.pem
docker build -t ansible ./ansible
docker container run -it --rm ansible ansible-playbook -i inventory.ini playbook.yml