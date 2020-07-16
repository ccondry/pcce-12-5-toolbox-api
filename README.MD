# PCCE Toolbox API

This is the dCloud PCCE instant demo toolbox REST API, for supporting the dcloud-pcce-12-5-toolbox-ui project. Should run on the branding VM inside the
dcloud instant demo session.

## Installation
```sh
git clone https://gitlab.com/dcloud-collab/dcloud-pcce-12-5-toolbox-api.git
cd dcloud-pcce-12-5-toolbox-api
npm install
cp .env.example .env
```

## Run
```sh
npm start
```

## Enable and Run as Service
```sh
sudo cp systemd.service /lib/systemd/system/dcloud-pcce-12-5-toolbox-api.service
systemctl enable dcloud-pcce-12-5-toolbox-api.service
systemctl start dcloud-pcce-12-5-toolbox-api.service
```
