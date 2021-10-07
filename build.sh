base=$(pwd)
./gradlew build
cd src/main/frontend/src
zip -qr $base/build/frontend.zip *
cd $base/build
cp libs/setserver.jar ..
zip -qur ../setserver.jar frontend.zip