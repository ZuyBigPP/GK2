document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const alarmSound = document.getElementById('alarmSound');
    var audioContext;
    let countdown;
  
    startBtn.addEventListener('click', function() {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.resume().then(() => {
      const minutes = parseInt(minutesInput.value);
      const seconds = parseInt(secondsInput.value);
  
      if (isNaN(minutes) || isNaN(seconds)) {
        alert('Vui lòng nhập số phút và giây hợp lệ.');
        return;
      }
  
      const totalSeconds = minutes * 60 + seconds;
  
      startCountdown(totalSeconds);
    });
    });
  
    resetBtn.addEventListener('click', function() {
      clearInterval(countdown);
      minutesInput.value = '';
      secondsInput.value = '';
      stopAlarm();
    });
    function stopAlarm() {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }
    function startCountdown(totalSeconds) {
      let secondsLeft = totalSeconds;
  
      countdown = setInterval(function() {
        secondsLeft--;
  
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
  
        displayTime(minutes, seconds);
  
        if (secondsLeft === 0) {
          clearInterval(countdown);
          playAlarm();
        }
      }, 1000);
    }
  
    function displayTime(minutes, seconds) {
      minutesInput.value = minutes < 10 ? '0' + minutes : minutes;
      secondsInput.value = seconds < 10 ? '0' + seconds : seconds;
    }
  
    function showNotification(message) {
      var notification = document.createElement('div');
      notification.textContent = message;
      notification.style.position = 'fixed';
      notification.style.top = '20px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.padding = '10px';
      notification.style.fontSize = '14px';
      notification.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
      notification.style.color = 'white';
      notification.style.borderRadius = '5px';
      document.body.appendChild(notification);
    
      setTimeout(function() {
        document.body.removeChild(notification);
      }, 5000);
    }


    
    function playAlarm() {
      alarmSound.currentTime = 0;
      alarmSound.loop = true;
      var promise = alarmSound.play();
  
      if (promise !== undefined) {
          promise.then(_ => {
              // Autoplay started!
              showNotification('Hết giờ!');
              resetBtn.style.display = 'inline-block';
              startBtn.style.display = 'inline-block';
          }).catch(error => {
              // Autoplay was prevented.
              // Show a "Play" button so that user can start playback.
              startBtn.style.display = 'inline-block';
          });
      }
  }
  
  });

var audio = document.getElementById('alarmSound');

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create an analyser node
var analyser = audioContext.createAnalyser();

var source = audioContext.createMediaElementSource(audio);



source.connect(analyser);
analyser.connect(audioContext.destination);

var canvas = document.getElementById('audioWave');
var canvasCtx = canvas.getContext('2d');
function draw() {
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);

  // Clear the canvas
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);


  for (var i = 0; i < frequencyData.length; i++) {
      var value = frequencyData[i];
      var percent = value / 255;
      var height = canvas.height * percent; 
      var offset = canvas.height - height; 
      var barWidth = canvas.width / frequencyData.length * 69; 
      var r = Math.floor((i / frequencyData.length) * 255);
    var g = Math.floor((value / 255) * 255);
    var b = Math.floor((1 - (value / 255)) * 255);
    canvasCtx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',0.5)';
      canvasCtx.fillRect(i * barWidth, offset, barWidth, height);
  }

  requestAnimationFrame(draw);
}

draw();



