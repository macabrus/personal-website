if [ -f pid.txt ]; then
  APP_PID=$(cat pid.txt)
  kill $APP_PID
  while ps -p $APP_PID; do
    echo "waiting for process $APP_PID to finish"
    sleep 1
  done;
fi
git reset --hard HEAD
eval `ssh-agent -s`
ssh-add ~/.ssh/gitlab-bot
git pull
npm i
nohup node app.js > logfile.txt 2>&1 &
echo $! > pid.txt
