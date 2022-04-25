function setImages(image, source = 'local') {
  if (image) {
    const images = document.getElementById('hidolly-images');
    innerImg = document.createElement('img');
    innerImg.src = (source === 'local')
      ? `assets/images/ai/${image}`
      : `data:image/png;base64,${image}`;
    innerImg.className = 'hidolly-img';
    images.appendChild(innerImg);
  }
}

function setTime(querytime, source) {
  if (source === 'local') return;
  const time = document.getElementById('hidolly-time')
  time.classList.add('active-animation');
  if (querytime) time.innerText = querytime;
}

function setBackgroundColor(divName) {
  const timer = document.getElementById(divName);
  timer.style.backgroundColor = 'slategray';
  timer.classList.remove('active-animation');
}

function clearInnerHtmlDiv(divName) {
  document.getElementById(divName).innerHTML = '';
}

const options = ((source, final_transcript, numImages) => {
  return {
    dalle: { 
      method: 'POST',
      headers: {
        'Bypass-Tunnel-Reminder': "go",
        'mode': 'no-cors'
      },
      body: JSON.stringify({
          'text': final_transcript.replaceAll('stop', '').trim(),
          'num_images': numImages,
      })
    },
    local: {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
      },
    }
  }[source];
});

setEndpoint = (source) => {
  return {
    local: new URL('images/CBI1-Thrav2EDPAyAGo2Cg', window.location),
    dalle: 'https://rude-cougar-7.loca.lt/dalle',
  }[source]
}

function parseReviver(key, value) {
  if (typeof value === 'string' && /^\d+n$/.test(value)) {
      return BigInt(value.slice(0, -1));
  }
  return value;
}

async function fetchImagesToServer(final_transcript, source = 'local', reload = false, phone = null) {
  console.log('fetchImagesToServer', final_transcript, source, reload, phone)

  const queryStartTime = new Date().getTime();
  setTime(' ', source);
  const fetchOptions = options(source, final_transcript, 2)
  const url = setEndpoint(source);
  console.log('fetchImagesToServer url',url)
  const response = await fetch(url, fetchOptions);
  
  const body = (source === 'local') 
    ? await response.json() 
    : {
      'executionTime': Math.round(((new Date() - queryStartTime) / 1000 + Number.EPSILON) * 100) / 100,
      'images': JSON.parse(await response.text(), parseReviver)
    }
  console.log(body, 'body')
  setTime(body.executionTime,  source);
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);  }
  
  if (reload) clearInnerHtmlDiv('hidolly-images')
  body.images.map(image => setImages(image, source));
  
  if (body?.executionTime) setBackgroundColor('hidolly-time');
  if (phone) saveToServer('smsimage', final_transcript, phone, body.images);
  return body;
}

fetchImagesToServer('none','local',false)