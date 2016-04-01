var { AudioRecorder, AudioPlayer, AudioMixer } = require('../Audio');
import moment from 'moment';
import RNFS from 'react-native-fs';
import Constants from '../utils/constants.js'
import RecordingsActions from './recordings'

var actions = exports = module.exports

exports.CHANGE_SONG = 'CHANGE_SONG'

exports.REFRESH_SONG = 'REFRESH_SONG'
exports.PLAY_SONG = 'PLAY_SONG'
exports.STOP_SONG = 'STOP_SONG'

exports.START_RECORDING = 'START_RECORDING'
exports.PAUSE_RECORDING = 'PAUSE_RECORDING'
exports.STOP_RECORDING = 'STOP_RECORDING'

exports.TOGGLE_MUTE = 'TOGGLE_MUTE'
exports.SET_CURRENT_TIME = 'SET_CURRENT_TIME'

exports.changeSong = function(song) {
  return {
    type: actions.CHANGE_SONG,
    song: song
  }
}

exports.playSong = function() {
  return (dispatch, getState) => {
    var songplayer = getState().songplayer;
    var song = songplayer.currentSong;

    // Prepare recording.
    AudioRecorder.prepareRecordingAtPath(Constants.getRecordingPath(song),
      {SampleRate: 44100.0, Channels: 2, AudioQuality: 'High' });

    AudioPlayer.onStart = (data) => {
      _startRecording(dispatch, getState);
    }
    AudioPlayer.setStartSubscription();

    AudioPlayer.onProgress = (data) => {
      dispatch({
        type: actions.SET_CURRENT_TIME,
        duration: data.currentDuration,
        time: data.currentTime
      })
    }
    AudioPlayer.setProgressSubscription();

    AudioPlayer.onFinished = (data) => {
      _stopSong(dispatch, getState);
    }
    AudioPlayer.setFinishedSubscription();

    // Start playing the song.
    AudioPlayer.play(Constants.getSongPath(song), {sessionCategory: 'PlayAndRecord'});
    dispatch({
      type: actions.PLAY_SONG
    });
  }
}

function _stopSong(dispatch, getState) {
  var songplayer = getState().songplayer;
  if (songplayer.isActive) {
    _stopRecording(dispatch, getState);
  }
  if (songplayer.isPlaying) {
    AudioPlayer.stop();
    dispatch({
      type: actions.STOP_SONG
    })
  }
}

exports.stopSong = function() {
  return (dispatch, getState) => {
    _stopSong(dispatch, getState);
  }
}

function _startRecording(dispatch, getState) {
  var songplayer = getState().songplayer;
  if (!songplayer.isRecording && songplayer.isPlaying) {
    AudioRecorder.startRecording();
    AudioPlayer.getCurrentTime((time) => {
      dispatch({
        type: actions.START_RECORDING,
        time: time,
      })
    })
  }
}

exports.startRecording = function() {
  return (dispatch, getState) => {
    _startRecording(dispatch, getState);
  }
}

exports.pauseRecording = function() {
  return (dispatch, getState) => {
    var songplayer = getState().songplayer;
    if (songplayer.isRecording) {
      AudioRecorder.pauseRecording();
      AudioPlayer.getCurrentTime((time) => {
        dispatch({
          type: actions.PAUSE_RECORDING,
          time: time,
        })
      })
    }
  }
}

var _stopRecording = function(dispatch, getState) {
  var songplayer = getState().songplayer;
  if (songplayer.isRecording) {
    AudioPlayer.getCurrentTime((time) => {
      dispatch({
        type: actions.STOP_RECORDING,
        time: time,
      })
      var song = songplayer.currentSong;
      var path = Constants.getFinalRecordPath(song, new Date());
      AudioRecorder.onFinished = function(data) {
        if (data.status != 'OK') {
          console.log(">>> Recording failed ", data);
          // TODO handle this failure.
          return;
        }
        songplayer = getState().songplayer;
        AudioMixer.mixAudio(Constants.getSongPath(song),
          data.audioFileURL,
          songplayer.recordingPeriods,
          path,
          (error, success) => {
            if (!error) {
              console.log(">>> No Error, Yaay! ", success);
              dispatch({
                type: RecordingsActions.ADD_RECORDING,
                recording: {
                  path: success.audioFileURL,
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
      }
      AudioRecorder.stopRecording();
    })
  }
}

exports.stopRecording = function() {
  return (dispatch, getState) => {
    _stopRecording(dispatch, getState);
  }
}

exports.toggleMute = function() {
  return {
    type: actions.TOGGLE_MUTE
  }
}

exports.offsetPlayerTime = function(time) {
  return {
    type: actions.SET_CURRENT_TIME,
    time: time
  }
}
