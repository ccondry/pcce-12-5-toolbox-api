#!/bin/sh
echo "Installing pcce-12-5-toolbox-api..."
echo "running npm install"
npm i
if [ $? -eq 0 ]; then
  echo "edit .env file first"
  vim .env
  echo "creating certs directory"
  mkdir ./certs
  echo "copying toolbox public cert from /etc/ssl/certs to local folder"
  cp /etc/ssl/certs/toolbox.pem ./certs/rsa-public.pem
  echo "installing systemd service..."
  sudo cp systemd.service /lib/systemd/system/pcce-12-5-toolbox-api.service
  sudo systemctl enable pcce-12-5-toolbox-api.service
  echo "starting systemd service..."
  sudo sudo /bin/systemctl start pcce-12-5-toolbox-api.service
else
  echo "npm install failed"
fi
