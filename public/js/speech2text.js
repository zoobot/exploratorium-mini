// WEB KIT SPEECH TO TEXT

let final_transcript = '';
let recognizing = false;
let ignore_onend;
let start_timestamp;
console.log(final_transcript)
if (!('webkitSpeechRecognition' in window)) {
  showInfo('info_upgrade');
} else {
  // start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  
  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    start_img.src = 'assets/images/mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'assets/images/mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'assets/images/mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'assets/images/mic.gif';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      showInfo('info_upgrade');
      return;
    }
    
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = final_transcript;
    interim_span.innerHTML = interim_transcript;
    setTimeout(() => showInfo('info_save'), 2000);
    
    if (sayStop(interim_transcript) || sayStop(final_transcript)) {
      stop()
    }
    if (sayStop(final_transcript) && !recognizing) {
      saveToServer();
    }
    
  };
}

const sayStop = (transcript) => transcript.includes('stop')

function stop() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  } 
}

// function finalizeTranscript() {
//   // var n = final_transcript.indexOf('\n');
//   // if (n < 0 || n >= 150) {
//   //   n = 40 + final_transcript.substring(40).indexOf(' ');
//   // }
//   return final_transcript
  
// }

async function saveToServer() {
  console.log('saveToServer', final_transcript)
  // finalizeTranscript()
  const fetchOptions = {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
   },
   body: JSON.stringify({
    from: 'webform',
    message: final_transcript.replaceAll('stop', '').trim(),
    timestamp: new Date().toISOString(),
    }),
  };
  const endpoint = 'webin/CBI1-Thrav2EDPAyAGo2Cg';
  const url = new URL(endpoint, window.location);
  const response = await fetch(url, fetchOptions);

  const body = await response.json();
  if (!response.ok) {
   const errorMessage = await response.text();
   throw new Error(errorMessage);
  }

  return body;
}

// TEXT FORMATTING
const firstChar = /\S/;
function capitalize(str) {
  return str.replace(firstChar, (m) => m.toUpperCase());
}

const randomIndex = (imageLength) => Math.floor(Math.random() * imageLength);

function askForRandomStuff() {
  const askStuff = ['Describe an animal you wish existed', 
  'Describe yourself and what you are wearing', 
  'Describe your favorite food',
  'Describe an place you wish existed']
  return askStuff[randomIndex(askStuff.length)];
}

function infoDirections(status) {
  return {
    'info_speak_now': askForRandomStuff(),
    'info_save': 'Say "Stop" to end the session.',
    'info_no_speech': `No speech was detected. You may need to adjust your <a href=
      "https://support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone
      settings</a>.`,
    'info_no_support': `Your browser does not support this demo.`,
    'info_no_microphone': `No microphone was found. Ensure that a microphone is installed and that 
      <a href="chrome://settings/contentExceptions#media-stream">microphone settings</a>
      are configured correctly.`,
    'info_denied': `Permission to use microphone was denied.`,
    'info_blocked': `Permission to use microphone is blocked. To change, go to
      chrome://settings/contentExceptions#media-stream`,
    'info_upgrade': `Web Speech API is not supported by this browser. Upgrade to <a href=
      "https://www.google.com/chrome">Chrome</a> version 25 or later.`,
  }[status];
}

function showInfo(status) {
  if (status) {
    const temp = document.getElementById("info");
    temp.innerText = infoDirections(status);
  }
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = ['en-US','United States'],
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  // start_img.src = 'assets/images/mic-animated.gif';
  start_timestamp = event.timeStamp;
}