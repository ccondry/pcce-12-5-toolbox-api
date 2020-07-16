#!/bin/sh
echo "Uninstalling pcce-12-5-toolbox-api..."
echo "Disabling systemd service..."
sudo systemctl disable pcce-12-5-toolbox-api.service
echo "Uninstall finished. You can now remove this folder if you wish."
