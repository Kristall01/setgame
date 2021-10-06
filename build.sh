base=$(pwd)
gradle build
cd src/main/frontend/src
zip -q -r $base/build/frontend.zip *
cd $base/build
zip -ur ../setserver.jar frontend.zip
cp libs/setserver.jar ..