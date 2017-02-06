if [ -z "$GIT_BRANCH" ]; then GIT_BRANCH=origin/master; fi
if [ -z "$GIT_PATH" ]; then GIT_PATH=/root/linked-data-proxy; fi

cd /root/
git clone https://github.com/pulipulichen/linked-data-proxy.git
cd $GIT_PATH
git reset --hard origin/master

sudo apt-get install curl -y
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
bash npm_install.sh