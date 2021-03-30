if [ -f pid.txt ]; then
  APP_PID=$(cat pid.txt)
  kill -0 "$APP_PID"
  wait "$APP_PID"
fi
git reset --hard HEAD
eval `ssh-agent -s`
ssh-add ~/.ssh/gitlab-bot
git pull
npm i
nohup node app.js > logfile.txt 2>&1 &
echo $! > pid.txt
