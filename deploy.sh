echo == Prepare working folder ==

WORKING_FOLDER="./foreign-exchange-currency-app/"

if [ -d "$WORKING_FOLDER" ]; then
  # Control will enter here if $WORKING_FOLDER exists.
  rm -R $WORKING_FOLDER
fi

echo == Stop and remove existing container ==

name="foreign-exchange-currency-app"

if [ "$(docker ps -q -f name=$name)" ]; then
    # stop
    docker stop $name
fi

if [ "$(docker ps -aq -f status=exited -f name=$name)" ]; then
    # cleanup
    docker rm $name
fi

WORKING_FOLDER="./foreign-exchange-currency-app/"

if [ -d "$WORKING_FOLDER" ]; then
  # Control will enter here if $WORKING_FOLDER exists.
  rm -R $WORKING_FOLDER
fi

echo == Git Clone branch master ==

git clone -b master https://github.com/anggaHermawan/foreign-exchange-currency-app.git

echo == Build and  run docker image ==
cd foreign-exchange-currency-app
docker build -f Dockerfile -t "foreign-exchange-currency-app" .
docker tag foreign-exchange-currency-app foreign-exchange-currency-app:latest
docker create --name foreign-exchange-currency-app -p 13000:3000 foreign-exchange-currency-app
docker start foreign-exchange-currency-app

echo == Done, please check http://ip-address:13000 ==
