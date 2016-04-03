function initializeApp() {
  var app = angular.module('KuhuAdminApp', ['ngMaterial', 'ngMdIcons', 'ngRoute', 'ngMessages', 'angular-sortable-view'])
  .config(function($routeProvider) {
            $routeProvider.when('/', {
                    templateUrl: 'songpack.tpl',
                    controller: 'SongCtrl',
                    controllerAs: 'songctrl'
                }).otherwise({
                    redirectTo: '/',
                    templateUrl: 'songpack.tpl',
                    controller: 'SongCtrl',
                    controllerAs: 'songctrl'
                });
        });

  var showError = function(title, message, $mdDialog) {
      alert = $mdDialog.alert({
        title: title,
        content: message,
        ok: 'Close'
      });
      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
  };

  app.factory("songs", function() {
    var songs = {};
    songs.list = [];
    songs.dict = {};
    songs.addSongs = function(newSongs) {
      angular.forEach(newSongs, function(song) {
        if (!songs.dict[song.id]) {
          songs.dict[song.id] = song;
          songs.list.push(song);
        }
      })
    }
    return songs;
  });

  app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
  }]);

  app.controller('MainCtrl', function($scope, $mdSidenav, $http, songs) {
        var self = this;
        self.toggleSidenav = function(menuId) {
          $mdSidenav(menuId).toggle();
        };
        $http.get('/restadmin/songs').then(function(response) {
          console.log(response.data);
          songs.addSongs(response.data.songs);
        }, function() {
          // Failed
          console.log(">> setting songs");
        });
  });

  app.controller('SongCtrl', function($scope, $routeParams, $http, $mdDialog, songs) {
      var self = this;
      self.songs = songs.list;
      self.onSongModified = function(chip, song) {
          song.isModified = true;
          return chip;
      };

      self.onSort = function(song, partFrom, partTo, indexFrom, indexTo) {
        var index = 0;
        angular.forEach(partTo, function(value) {
            if (value.order != index) {
                value.order = index;
                value.isModified = true;
            }
            index++;
        });
      };

      self.uploadsong = function() {
        var songToUpload = self.songFile;
        var formData = new FormData();
        formData.append('file', songToUpload);
        console.log(">>> ", songToUpload);
        if (songToUpload.name.endsWith('.json')) {
          $http.post('/restadmin/import', formData, {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
          .then(function(response) {
            songs.addSongs(response.data);
          }, function() {
            // Failed
          });
        } else if (songToUpload.name.endsWith('.mp3')) {
          $http.post('/restadmin/upload', formData, {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
          .then(function(response) {
            // Success
            try {
              songs.addSongs([response.data]);
            } catch(err) {
            }
          }, function() {
            // Failed
          });
        }
      }

      self.save = function() {
          // go through all the songs in this pack and update backend.
          var modifiedsongs = [];
          angular.forEach(self.songs, function(value, key) {
              if (value.isModified) {
                  modifiedsongs.push(value);
              }
          });
          var data = {data: JSON.stringify(modifiedsongs), action: "SAVE_SONGS"};
          $http.post('/restadmin/song', data, {headers: {'Content-Type': 'application/json'}}).then(function() {
               // Success
              angular.forEach(modifiedsongs, function(value, key){
                  value.isModified = false;
              });
          }, function() {
            // Failed..
            showError("Error!!", "Saving songs in " + songPackId + " failed. Please retry!", $mdDialog);
          });
      };
  });
}
