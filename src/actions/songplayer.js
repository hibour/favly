var { AudioRecorder, AudioPlayer, AudioMixer } = require('../Audio');
const moment = require('moment');
import Constants from '../utils/constants.js'
import RecordingsActions from './recordings'

var actions = exports = module.exports

exports.CHANGE_SONG = 'CHANGE_SONG'

exports.REFRESH_SONG = 'REFRESH_SONG'
exports.PLAY_SONG = 'PLAY_SONG'
exports.PAUSE_SONG = 'PAUSE_SONG'

exports.STOP_SONG = 'STOP_SONG'

exports.TOGGLE_MUTE = 'TOGGLE_MUTE'
exports.SET_CURRENT_TIME = 'SET_CURRENT_TIME'

exports.changeSong = function changeSong(song) {
  return {
    type: actions.CHANGE_SONG,
    song: song
  }
}

var _resumeSong = function(dispatch, getState) {
  var songplayer = getState().songplayer;
  AudioPlayer.unpause();
  AudioRecorder.startRecording();
  dispatch({
    type: actions.PLAY_SONG
  });
}

var _playSong = function(dispatch, getState) {
  var songplayer = getState().songplayer;
  var song = songplayer.currentSong;

  // Prepare recording.
  AudioRecorder.prepareRecordingAtPath(
    Constants.getRecordingPath(songplayer.currentSong),
    {SampleRate: 44100.0, Channels: 2, AudioQuality: 'High' }
  );

  var didWeStartRecording = false;
  AudioPlayer.onStart = (data) => {
    if (!didWeStartRecording) {
      didWeStartRecording = true;
      AudioRecorder.startRecording();
      console.log(">>>>> Recording started at " + new Date().getTime());
    }
  }

  AudioPlayer.onProgress = (data) => {
    dispatch({
      type: actions.SET_CURRENT_TIME,
      duration: data.currentDuration * 1000,
      time: data.currentTime * 1000
    })
  }

  AudioPlayer.onFinished = (data) => {
    actions.stopSong();
  }
  AudioPlayer.setStartSubscription();
  AudioPlayer.setProgressSubscription();
  AudioPlayer.setFinishedSubscription();

  // Start playing the song.
  AudioPlayer.play(Constants.getSongPath(song), {sessionCategory: 'PlayAndRecord'});
  dispatch({
    type: actions.PLAY_SONG
  });
}

exports.playSong = function playSong() {
  return (dispatch, getState) => {
    var songplayer = getState().songplayer;
    if (songplayer.isActive) {
      _resumeSong(dispatch, getState);
    } else {
      _playSong(dispatch, getState);
    }
  }
}

exports.pauseSong = function pauseSong() {
  return (dispatch, getState) => {
    var songplayer = getState().songplayer;
    if (songplayer.isPlaying) {
      AudioPlayer.pause();
      AudioRecorder.pauseRecording();
      dispatch({
        type: actions.PAUSE_SONG
      })
    }
  }
}

exports.stopSong = function stopSong() {
  return (dispatch, getState) => {
    var songplayer = getState().songplayer;
    if (songplayer.isPlaying) {
      AudioRecorder.onFinished = function(data) {
        if (data.status != 'OK') {
          console.log(">>> Recording failed ", data);
          // TODO handle this failure.
          return;
        }
        songplayer = getState().songplayer;
        var song = songplayer.currentSong;

        var path = Constants.getFinalRecordPath(song, new Date());

        AudioMixer.mixAudio(Constants.getSongPath(song),
          data.audioFileURL,
          path,
          (error, success) => {
            if (!error) {
              console.log(">>> No Error, Yaay! ", success);
              dispatch({
                type: RecordingsActions.ADD_RECORDING,
                recording: {
                  path: path,
                  title: song.title,
                  songid: song.id,
                  album: song.album,
                  thumbnail: song.thumbnail,
                  time: moment().toISOString()
                }
              })
            } else {
              console.log(">>> Failed :( ", error, success);
              //TODO Show error to the user.
            }
          })
      };

      AudioPlayer.stop();
      AudioRecorder.stopRecording();
      dispatch({
        type: actions.STOP_SONG
      });
    }
  }
}

exports.toggleMute = function toggleMute() {
  return {
    type: actions.TOGGLE_MUTE
  }
}

exports.setCurrentTime = function setCurrentTime(time) {
  return {
    type: actions.SET_CURRENT_TIME,
    time: time
  }
}
