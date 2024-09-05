export $(cat .env | xargs)
cp myKey.pem ansible/playbook
cp -r backend ansible/playbook
cp -r frontend ansible/playbook
cp docker-compose.yml ansible/playbook
docker container run -it --rm -v $PWD/terraform:$PWD/terraform -w $PWD/terraform -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY hashicorp/terraform init
docker container run -it --rm -v $PWD/terraform:$PWD/terraform -w $PWD/terraform -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY hashicorp/terraform plan -out=terraform.tfplan
docker container run -it --rm -v $PWD/terraform:$PWD/terraform -w $PWD/terraform -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY hashicorp/terraform apply -auto-approve terraform.tfplan
docker container run -it --rm -v $PWD/terraform:$PWD/terraform -w $PWD/terraform hashicorp/terraform output -json > tmp/output.json
ips=$(jq -r '.app_server_public_ip.value[]' tmp/output.json)
echo "[default]" > ansible/playbook/inventory.ini
for ip in $ips; do
  echo "$ip" >> ansible/playbook/inventory.ini
done
chmod 400 ansible/playbook/myKey.pem
docker build -t ansible ./ansible
docker container run -it --rm ansible ansible-playbook -i inventory.ini playbook.yml