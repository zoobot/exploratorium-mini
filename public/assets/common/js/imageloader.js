function setImages(image) {
    if (image) {
      const images = document.getElementById('images');
      innerImg = document.createElement('img');
      innerImg.src = `assets/common/images/ai/${image}`;
      innerImg.className = 'hidolly-img';
      images.appendChild(innerImg);
    }
  }

async function fetchImagesToServer() {
    const fetchOptions = {
     method: "GET",
     headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
     },
    };
    const endpoint = 'images/CBI1-Thrav2EDPAyAGo2Cg';
    const url = new URL(endpoint, window.location);
    const response = await fetch(url, fetchOptions);
    const body = await response.json();
    if (!response.ok) {
     const errorMessage = await response.text();
     throw new Error(errorMessage);
    }
    body.images.map(image => setImages(image));
    return body;
  }

  fetchImagesToServer()