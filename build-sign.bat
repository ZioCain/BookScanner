echo "Building app (ionic cordova)"
ionic cordova build android --prod --release --quiet
# keytool -genkey -v -keystore wpreader.keystore -alias ZioCain -keyalg RSA -keysize 2048 -validity 10000
echo "Signing app (jarsigner)"
jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore bookscanner.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ZioCain
echo "Aligning zip (zipalign)"
rm -f platforms/android/app/build/outputs/apk/release/app-release-signed.apk
zipalign 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/apk/release/app-release-signed.apk
