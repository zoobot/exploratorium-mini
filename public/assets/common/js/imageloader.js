function setBackground(image) {
    var body = document.getElementById('grid');
    imagePath = `url(assets/common/images/ai/${image})`;
    console.log('imagePath',imagePath);
    body.style.backgroundImage = imagePath;;
    console.log(body.style);
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
    const url = `${window.location}${endpoint}`;
    const response = await fetch(url, fetchOptions);
    const body = await response.json();
    if (!response.ok) {
     const errorMessage = await response.text();
     throw new Error(errorMessage);
    }
    const imageLength = body.Images.length;
    const randomImage = Math.floor(Math.random() * imageLength);
    setBackground(body.Images[randomImage]);
    return body;
  }
  fetchImagesToServer()