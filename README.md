# EraseIn

A free, unlimited, in-browser background remover. Remove backgrounds from thousands of images directly in your browser, without uploading your files anywhere.

## Features

- 100% FREE and UNLIMITED. No account, no sign-up, no hidden costs.
- 100% private. Images are processed locally in your browser and never leave your device.
- Batch processing. Drag and drop multiple images at once and process them in a queue.
- Export options. Choose format (PNG, WEBP, JPG), background color (transparent, white, black, red, custom, random), and quality (LOW, STANDARD, HD).
- Download all. Export every processed image at once as a ZIP file.
- Before/after comparison. View the original and the result side by side with a draggable slider.
- History page. Every processed image is automatically stored for 1 day (24 hours).
- Dark/light theme. Toggle between light and dark mode.
- Clean cutouts with high detail, powered by the isnet_fp16 model running locally through WebGL.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [@imgly/background-removal](https://github.com/imgly/background-removal) for on-device background removal
- [Dexie](https://dexie.org) (IndexedDB) for local storage
- [Zustand](https://zustand.docs.pmnd.rs) for state management
- [JSZip](https://stuk.github.io/jszip/) and [file-saver](https://github.com/eligrey/FileSaver.js) for ZIP exports

## Prerequisites

- Node.js 20 or later
- [pnpm](https://pnpm.io) (this project uses pnpm; check with `pnpm --version`)

## Clone the Project

```bash
git clone https://github.com/nobel-saputra/erasein
cd erasein
```

## Install Dependencies

```bash
pnpm install
```

## Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
pnpm build
pnpm start
```

## How to Use

### 1. Add Images

On the Dashboard, drag and drop images onto the dropzone area, or click the dropzone to select files from your device.

- Supported formats: JPG, PNG, WEBP.
- You can add as many images as you like; there is no limit.

### 2. Wait for Processing

The first time you add an image, the background removal model is loaded into your browser's WebGL memory. This only happens once, so please wait a moment.

After the model is ready, every image in the queue is processed automatically. Each image shows one of these statuses:

- Waiting - queued and not processed yet.
- Processing - the background is currently being removed.
- Done - the background has been removed.
- Failed - something went wrong with this image.

You can use the filter pills (All, Waiting, Processing, Done, Failed) to view only the images you care about.

### 3. Customize Export Settings

Open the Settings panel (the tune icon) to adjust options. Settings apply to the entire processing queue at once.

- Format - export as PNG (transparent), WEBP, or JPG. Note: JPG does not support transparency; if you pick JPG with a transparent background, the background will be forced to white.
- Background - transparent, white, black, red, a custom color, or a random color.
- Quality - LOW (50% resolution), STANDARD (100%), or HD (200%).

### 4. Download Your Images

For each finished image you can:

- Download - save the processed image with the selected format, background, and quality.
- View - open the before/after comparison and drag the slider left or right to compare.

To download everything at once, click "Download All as ZIP". The ZIP file contains every image that has finished processing.

### 5. Manage the Queue

- Delete - remove a single image from the queue.
- Clear Data - remove all images and processing data at once.
- When deleting, you can pick "Always" to skip the confirmation dialog from then on.

### 6. Use the History Page

Processed images are automatically saved to the History page, reachable from the menu in the top navigation bar.

- Images in History are only stored for 1 day (24 hours) and are then permanently deleted automatically.
- From History you can download any image again or delete it individually, and you can delete everything with "Delete All".

### 7. Privacy and Data

- All processing happens in your browser, on your device. Your images are never uploaded to any server.
- Images are stored locally in your browser's IndexedDB and are used only to restore your queue and History.
- Clear your History or use Clear Data at any time to remove everything.

## Project Structure

```
app/          Next.js pages and layouts
components/   UI components (navbar, dropzone, image list, dialogs)
lib/          Database, queue, and state management
public/       Static assets (icons, logos)
```

## License

All rights reserved.
