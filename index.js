import express from "express"
import path from "path"
import multer from "multer"
import fs from "fs"
import { exportImages } from 'pdf-export-images'
import {destroyPreviousRequestedImg, destroyView} from "./controllers/PdfImageExtractorController.js";


const app = express();
const port = 3001;

// Configure multer for file uploads
const upload = multer({ dest: 'public/uploadPDF/' });

app.set("view engine", "ejs")
app.set("views", path.resolve('views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve('public')))


app.get('/', (req, res) => {
  res.send('PDF Image Extraction App');
});

app.post('/destroy', destroyPreviousRequestedImg)
app.get('/destroy', destroyView)
app.get('/destroy', destroyView)
app.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  let requestedPdf = req.file.path;

// Generate a random integer between a minimum and maximum value (inclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// const min = 1;
// const max = 10;
let randomInt = getRandomInt(10000000, 90000000);
//   console.log(randomInt);

const folderName = `public/uploaded/${randomInt}`;

fs.mkdir(folderName, (err) => {
  if (err) {
    console.error('Error creating folder:', err);
  } else {
    console.log('Folder created successfully');
    // Schedule folder deletion after 10 seconds
    setTimeout(() => {
      fs.rmdir(folderName, { recursive: true }, (err) => {
        if (err) {
          console.error('Error removing folder:', err);
        } else {
          console.log('Folder removed successfully after 10 seconds');
        }
      });
    }, 10000); // 10 seconds
  }
});


  // Function to delete a file after a specified duration (in milliseconds)
  function deleteFileAfterDelay(filePath, delay) {
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return;
          }
          console.log(`File deleted: ${filePath}`);
        });
      }, delay);
    }
    
    deleteFileAfterDelay(requestedPdf, 10000);

  let responseImage = { photoIMG: "", signatureIMG: "", mass: '', originals: []}
  let baseUrl = `${req.protocol}://${req.get('host')}/`
  let response = await exportImages(requestedPdf, path.resolve(`public/uploaded/${randomInt}`))
  .then(async (res) => { return res})
  for (let createImage of response) {

      let filenameSv = `img_p0_200`
      let filenamePv = `img_p0_100`
      responseImage['mass'] = `${randomInt}/img_p0_100`
      
      if (createImage.name === 'img_p0_2') {
          responseImage['signatureIMG'] = `${baseUrl}uploaded/${randomInt}/${filenameSv}.png`
          let signatureIMG = `uploaded/${randomInt}/${filenameSv}.png`
      }
      if (createImage.name === `img_p0_1`) {
          responseImage['photoIMG'] = `${baseUrl}uploaded/${randomInt}/${filenamePv}.png`
          let photoIMG = `uploaded/${randomInt}/${filenamePv}.png`
      }
  }


  let publicFileSync = fs.readdirSync(`public/uploaded/${randomInt}`)
  if (publicFileSync.length) {
      for (let scanItem of publicFileSync) {
          let fileExtension = scanItem.split('.')
          if (fileExtension.pop() === 'png') {
              responseImage['originals'].push(`${baseUrl}uploaded/${randomInt}/${scanItem}`)
          }
      }
  }

  res.json({ data: responseImage })

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});