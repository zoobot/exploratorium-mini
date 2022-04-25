
const optionsLocalBackend = ((final_transcript) => {
  return {
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
  }
});

async function saveToServer(endpointShort, final_transcript, phone, images) {
  const fetchOptions = optionsLocalBackend(final_transcript);
  const endpoint = `${endpointShort}/CBI1-Thrav2EDPAyAGo2Cg`;
  const url = new URL(endpoint, window.location)
  console.log('url',url)
  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
   const errorMessage = await response.text();
   throw new Error(errorMessage);
  }

  const body = await response.json();
  if (!response.ok) {
   const errorMessage = await response.text();
   throw new Error(errorMessage);
  }

  return info;
}