FROM python:3.11-slim
RUN pip install ansible
RUN apt-get update
RUN apt-get install -y openssh-client
RUN pip install --upgrade requests urllib3
COPY ./playbook ./playbook
WORKDIR /playbook
RUN chmod 400 myKey.pem
CMD ["ansible-playbook", "-i", "inventory.ini", "playbook.yml"]