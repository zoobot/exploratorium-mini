const fs = require('fs');

function getImages(req, res) {
  if (!req?.params) res.status(404).send({ Success: false });
  res.status(200).send({ Success: true })
  console.log(`getImages ${inspect(req.params, false, 10, true)}`);
  const files = fs.readdirSync('assets/common/images/ai');
  res.status(200).send({ Success: true, Images: files });
}