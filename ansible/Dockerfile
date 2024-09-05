FROM python:3.7-slim
RUN pip install ansible
COPY ./playbook ./playbook
WORKDIR /playbook
CMD ["ansible-playbook", "-i", "inventory.ini", "playbook.yml"]