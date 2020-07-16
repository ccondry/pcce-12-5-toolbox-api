#!/bin/sh
echo "updating systemd service..."
sudo cp systemd.service /lib/systemd/system/pcce-12-5-toolbox-api.service
echo "running daemon-reload..."
sudo systemctl daemon-reload
echo "restarting service..."
sudo systemctl restart pcce-12-5-toolbox-api.service
echo "systemd service update complete!"
