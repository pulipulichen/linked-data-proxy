if [ -z "$GIT_BRANCH" ]; then GIT_BRANCH=origin/master; fi
if [ -z "$GIT_PATH" ]; then GIT_PATH=/root/linked-data-proxy; fi

cd $GIT_PATH
git clone git@github.com:pulipulichen/linked-data-proxy.git
git reset --hard origin/master