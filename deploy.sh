echo == Prepare working folder ==

WORKING_FOLDER="./Foreign-Exchange-Currency-App/"

if [ -d "$WORKING_FOLDER" ]; then
  # Control will enter here if $WORKING_FOLDER exists.
  rm -R $WORKING_FOLDER
fi

echo == Stop and remove existing container ==

name="Foreign-Exchange-Currency-App"

if [ "$(docker ps -q -f name=$name)" ]; then
    # stop
    docker stop $name
fi

if [ "$(docker ps -aq -f status=exited -f name=$name)" ]; then
    # cleanup
    docker rm $name
fi

WORKING_FOLDER="./Foreign-Exchange-Currency-App/"

if [ -d "$WORKING_FOLDER" ]; then
  # Control will enter here if $WORKING_FOLDER exists.
  rm -R $WORKING_FOLDER
fi

echo == Git Clone branch master ==

git clone -b master https://github.com/anggaHermawan/Foreign-Exchange-Currency-App.git

echo == Build and  run docker image ==
cd Foreign-Exchange-Currency-App
docker build -f Dockerfile -t "Foreign-Exchange-Currency-App" .
docker tag Foreign-Exchange-Currency-App Foreign-Exchange-Currency-App:latest
docker create --name Foreign-Exchange-Currency-App -p 13000:3000 Foreign-Exchange-Currency-App
docker start Foreign-Exchange-Currency-App

echo == Done, please check http://ip-address:13000 ==
