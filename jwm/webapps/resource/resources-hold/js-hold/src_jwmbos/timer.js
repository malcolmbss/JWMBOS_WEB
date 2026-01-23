var Timer = (function(){
  var instance = null;
  function PrivateConstructor(){
    var timer = null; // DOM element, that displays the page inactivity expiration time
    var remainingSeconds = 0; // Remaining seconds
    var initialSeconds = 0; // Time that was initially set
    var ticker = null; // Ticker which ticks every second
    var isRunning = false; // true, when the timer is running
    var timeExpiredAction = function(){
      console.log('Time expired.');
    };

    // 0) Method to set and display the timer
    this.createTimer = function(timerId,time,callback){
      if(typeof(callback) == 'function'){
        timeExpiredAction = callback;
      }
      timer = document.getElementById(timerId);
      initialSeconds = time;
      remainingSeconds = time;
      displayTime();
    };

    // 1) Starts the timer
    this.startTimer = function(){
      startTicking();
    };

    // 2) Internal method to realize the ticks
    var startTicking = function(){
      if(isRunning == true)
        return;
      else
        isRunning = true;

      function tick(){
        if (remainingSeconds <= 0){
          isRunning = false;
          displayTime();
          timeExpiredAction();
          return;
        }
        else{
          remainingSeconds -= 1;
          displayTime();
        }
        ticker = window.setTimeout(tick, 1000);
      }
      ticker = window.setTimeout(tick, 1000);
    };

    // 3) Internal method to display the time
    var displayTime = function(){
      function addLeadingZero(time){
        return (time < 10) ? '0' + time : + time;
      }
      var seconds = remainingSeconds;
      var days = Math.floor(seconds / 86400);
      seconds -= days * 86400;
      var hours = Math.floor(seconds / 3600);
      seconds -= hours * (3600);
      var minutes = Math.floor(seconds / 60);
      seconds -= minutes * (60);
      var timeString = ((days > 0) ? days + ' days ' : '')
      + addLeadingZero(hours)
      + ':' + addLeadingZero(minutes)
      + ':' + addLeadingZero(seconds)
      timer.value = timeString;
    };

    // 4) Pauses the timer
    this.pauseTimer = function(){
      window.clearTimeout(ticker);
      ticker = null;
      isRunning = false;
    };

    // 5) Continues the timer
    this.resumeTimer = function(){
      ticker = window.setTimeout(startTicking(), 10);
    };

    // 6) Pauses the timer, if it is running
    // OR continues the timer, if it is not running
    this.toggleTimer = function(){
      if(ticker != null)
        this.pauseTimer();
      else
        this.resumeTimer();
    };

    // 7) Resets the time to the initial time
    this.resetTimer = function(){
      remainingSeconds = initialSeconds;
      displayTime();
    };

    // 8) Resets the time to the initial time and starts ticking
    this.resetAndStartTimer = function(){
      this.resetTimer();
      startTicking();
    };

    // 9) Returns the remaining seconds of the timer
    this.getRemainingSeconds = function(){
      return remainingSeconds;
    };

    // 10) Sets the timer to a different time
    this.setSeconds = function(seconds){
      remainingSeconds = seconds;
      displayTime();
    };
  }
  return new function(){
    // Singleton for the timer
    this.getInstance = function(){
      if (instance == null){
        instance = new PrivateConstructor();
        instance.constructor = null;
      }
      return instance;
    }
  }
})();
