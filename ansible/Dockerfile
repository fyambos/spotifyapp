FROM python:3.7-slim
RUN pip install ansible
RUN apt-get update
RUN apt-get install -y openssh-client
COPY ./playbook ./playbook
WORKDIR /playbook
CMD ["ansible-playbook", "-i", "inventory.ini", "playbook.yml"]