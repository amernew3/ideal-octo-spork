const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs-extra');
const path = require('path');
const { igdl, ttdl } = require('ab-downloader');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Process CSV file
app.post('/process-csv', upload.single('csvFile'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Process each URL
        const downloadResults = [];
        
        for (const row of results) {
          const url = row.url || row.link; // Support both 'url' and 'link' column names
          if (!url) continue;
          
          try {
            let downloadData;
            
            if (url.includes('instagram.com')) {
              downloadData = await igdl(url);
            } else if (url.includes('tiktok.com')) {
              downloadData = await ttdl(url);
            } else {
              downloadResults.push({
                url: url,
                status: 'error',
                message: 'Unsupported platform'
              });
              continue;
            }
            
            downloadResults.push({
              url: url,
              status: 'success',
              data: downloadData
            });
          } catch (error) {
            downloadResults.push({
              url: url,
              status: 'error',
              message: error.message
            });
          }
        }
        
        // Clean up uploaded file
        await fs.remove(filePath);
        
        res.json({
          success: true,
          results: downloadResults
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Download media
app.get('/download-media', async (req, res) => {
  try {
    const { url, type } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    let downloadData;
    
    if (url.includes('instagram.com')) {
      downloadData = await igdl(url);
    } else if (url.includes('tiktok.com')) {
      downloadData = await ttdl(url);
    } else {
      return res.status(400).json({ error: 'Unsupported platform' });
    }
    
    // For simplicity, we're returning the download data
    // In a production app, you would actually download and serve the file
    res.json({
      success: true,
      data: downloadData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});