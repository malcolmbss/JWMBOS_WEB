      function  playVideo( type, playerId )
      {
//       console.log( "Play " + type + " " + playerId )
         if (type == "YouTube" )
         {
            YT.get( playerId ).playVideo();
         }
         if ( type == "Vimeo" )
         {
            var iFrame = document.getElementById( playerId );
            var vimeoPlayer = new Vimeo.Player(iFrame);
            vimeoPlayer.play();
         }

         if (( type == "File" )
          ||( type == "MP4" ))
         {
            var videoElement = document.getElementById( playerId );
            videoElement.play();
         }
      }

      function initYouTubePlayer( playerId, ndx )
      {
//       console.log( "initYouTubePlayer " + playerId + " " + ndx  + " " + youTubeReadyFlag );
         if ( !youTubeReadyFlag )
         {
            if ( ndx < 5 )
            {
               setTimeout( function(){initYouTubePlayer(playerId, ndx+1);}, 500 );
            }
         }
         var thePlayer = new YT.Player(playerId,
                                {
                                  events: {
                                             'onStateChange': onPlayerStateChange
                                          }
                                }
                        );
         return( thePlayer );
      }

      function onPlayerStateChange(event)
      {
         if (event.data == YT.PlayerState.PLAYING ) stopSlider();
         else  startSlider();
      }

      function initVimeoPlayer( playerId )
      {
//       console.log( "initVimeoPlayer " + playerId  );
         var iFrame = document.getElementById( playerId );
         var vimeoPlayer = new Vimeo.Player(iFrame);

         vimeoPlayer.on('play', stopSlider);
         vimeoPlayer.on('pause', startSlider);
         vimeoPlayer.on('ended', startSlider);
      }

      function startSlider()
      {
//       console.log( "startSlider" );
         jssor_slider1.$Play();
      }

      function stopSlider()
      {
//       console.log( "stopSlider" );
         jssor_slider1.$Pause();
      }

      function initVideoPlayer( playerId )
      {
//       console.log( "initVideoPlayer " + playerId  );
         var videoElement = document.getElementById( playerId );

         videoElement.addEventListener('play',   stopSlider, false);
         videoElement.addEventListener('pause', startSlider, false);
         videoElement.addEventListener('ended', startSlider, false);
      }

