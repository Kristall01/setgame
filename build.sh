base=$(pwd)
gradle build
cd src/main/frontend/src
zip -q -r $base/build/frontend.zip *
cd $base/build
cp libs/setserver.jar ..
zip -qur ../setserver.jar frontend.zip