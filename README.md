# Instagram & TikTok Bulk Downloader

A web application that allows you to download Instagram and TikTok videos in bulk by uploading a CSV file containing media URLs.

## Features

- Upload CSV files with Instagram and TikTok URLs
- Process multiple URLs simultaneously
- Download media files directly from the browser
- Simple and intuitive web interface

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd instagram-tiktok-downloader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Prepare a CSV file with a column named `url` containing Instagram and TikTok URLs:
   ```csv
   url
   https://www.instagram.com/p/example1/
   https://www.tiktok.com/@user/video/example2
   ```

2. Upload the CSV file using the web interface
3. Click "Process URLs" to begin downloading
4. Download the processed media using the provided links

## Supported Platforms

- Instagram (Posts, Stories, Reels)
- TikTok (Videos)

## Dependencies

- [ab-downloader](https://www.npmjs.com/package/ab-downloader) - Universal media downloader
- Express.js - Web framework
- Multer - File upload handling
- csv-parser - CSV file parsing

## Legal Notice

This application is for educational purposes only. Please ensure you comply with the terms of service of Instagram, TikTok, and other platforms when using this tool. Only download content that you have permission to access.

## License

MIT License