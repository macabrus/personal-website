kill $(cat pid.txt)
git reset --hard HEAD
eval `ssh-agent -s`
ssh-add ~/.ssh/gitlab-bot
git pull
npm i
npm start >logfile.txt 2>&1 &
echo $! > pid.txt
