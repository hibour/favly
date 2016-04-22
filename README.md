## Setup Steps
- npm install

### To run on iphone
- Open `ios/Favly.xcodeproj` in xcode and run the project.
- Modify `AppDelegate.m` and change `localhost` to your laptop's IP address
  - For example: `192.168.0.105:8081`

### To run on Android
- `react-native run-android`
- When it runs on your device, you will see a red color screen.
- Shake the device and you will get a list of options.
- Go into dev-settings and change the IP address to your laptop's
  - For example: `192.168.0.105:8081`

### Remote Debugging on iphone
- Modify `RCTWebSocketExecutor.m` and change `localhost` to your laptop's IP.
- Then inside the app, shake once and enable "Remote Debugging" 

## Deploying assets to firebase.
- First install firebase-tools using `sudo pm install -g firebase-tools`
- Then deploy using `firebase deploy`

### Generate LRC files
http://www.lrcgenerator.com/

### Telugu Karaoke tracks
http://www.telugulyrics.org/Tracks.aspx?Type=Movie

### Running backend
- cd server
- dev_appserver.py app.yaml
