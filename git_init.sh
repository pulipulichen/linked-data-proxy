if [ -z "$GIT_BRANCH" ]; then GIT_BRANCH=origin/master; fi
if [ -z "$GIT_PATH" ]; then GIT_PATH=/root/linked-data-proxy; fi

cd /root/
git clone https://github.com/pulipulichen/linked-data-proxy.git
cd $GIT_PATH
git reset --hard origin/master

apt-get install curl -y
curl -sL https://deb.nodesource.com/setup_7.x | bash -
apt-get install -y nodejs
bash npm_install.sh

bash start_app.sh