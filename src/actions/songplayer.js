var { AudioRecorder, AudioPlayer } = require('react-native-audio');
var Sound = require('react-native-sound');
const moment = require('moment');
import Constants from '../utils/constants.js'
import RecordingsActions from './recordings'

var actions = exports = module.exports

exports.CHANGE_SONG = 'CHANGE_SONG'

exports.PLAY_SONG = 'PLAY_SONG'
exports.PAUSE_SONG = 'PAUSE_SONG'

exports.START_RECORDING = 'START_RECORDING'
exports.STOP_RECORDING = 'STOP_RECORDING'

exports.TOGGLE_MUTE = 'TOGGLE_MUTE'
exports.SET_CURRENT_TIME = 'SET_CURRENT_TIME'

exports.changeSong = function changeSong(song) {
  return {
    type: actions.CHANGE_SONG,
    song: song
  }
}

exports.playSong = function playSong() {
  return (dispatch, getState) => {
    var songplayer = getState().songplayer;
    var songSound = songplayer.songSound;

    if (songSound) {
      songSound.play();

      // If we are also recording, play recording. we might have paused it.
      if (songplayer.isRecording) {
        AudioRecorder.startRecording();
      }
      dispatch({
        type: actions.PLAY_SONG,
        songSound: songSound
      });
    } else {

      var song = songplayer.currentSong;
      var songPath = Constants.getSongPath(song);
      songSound = new Sound(songPath, '', function(error) {
        if (error) {
          console.log('failed to load the sound', error);
        } else { // loaded successfully
          songSound.play();
          dispatch({
            type: actions.PLAY_SONG,
            songSound: songSound
          });
        }
      })
    }
  }
}

exports.pauseSong = function pauseSong() {
  return (dispatch, getState) => {
    var songplayer = getState().songplayer;
    var songSound = songplayer.songSound;
    if (songSound) {
      songSound.pause();

      // If we are also recording, pause recording.
      if (songplayer.isRecording) {
        AudioRecorder.pauseRecording();
      }
      dispatch({
        type: actions.PAUSE_SONG
      })
    }
  }
}

exports.startRecording = function startRecording() {
  return (dispatch, getState) => {
    var songplayer = getState().songplayer;
    if (!songplayer.isRecording) {
      AudioRecorder.prepareRecordingAtPath(
        Constants.getRecordingPath(songplayer.currentSong),
        {SampleRate: 22050.0, Channels: 2, AudioQuality: 'Medium', AudioEncoding: 'mp3', }
      );
      dispatch({
        type: actions.START_RECORDING
      })
    }
  }
}

exports.stopRecording = function stopRecording() {
  return (dispatch, getState) => {
    var songplayer = getState().songplayer;
    var songSound = songplayer.songSound;
    if (songplayer.isRecording) {
      AudioRecorder.stopRecording();
      if (songSound) {
        songSound.stop();
      }
      dispatch({
        type: actions.STOP_RECORDING
      });

      var song = songplayer.currentSong;
      var path = Constants.getRecordingAbsolutePath(Constants.getRecordingPath(song));
      dispatch({
        type: RecordingsActions.ADD_RECORDING,
        recording: {
          path: Constants.getRecordingPath(song),
          title: song.title,
          songid: song.id,
          time: moment().toISOString()
        }
      })
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
