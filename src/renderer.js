
function setupFetchButton() {
  // Get DOM elements for display videos
  const input = document.getElementById('urlInput');
  const fetchButton = document.getElementById('FetchButton');
  const output = document.getElementById('outputContainer');

  fetchButton.addEventListener('click', async () => {

    const url = input.value;

    // Show loading
    document.getElementById('loading').style.display = 'block';
    try {
      // Fetch video information
      const info = await window.api.fetchVideoInfo(url);

      // Clear the output container
      output.innerHTML = ``;

      // display videos
      window.ui.buildVideosTable(info, output);

    } catch (err) {
      console.error('Error fetching info:', err.message);
    } finally {
      // Hide loading
      document.getElementById('loading').style.display = 'none';
    }
  });
}

function setupVideoCongfiguration() {
  // Get DOM elements for video configuration
  const filter = document.getElementById('filter');
  const quality = document.getElementById('quality');
  const pathButton = document.getElementById('pathButton');

  const startButton = document.getElementById('startButton');

  pathButton.addEventListener('click', async () => {
    const path = await window.api.selectFolder();
    pathButton.value = path;
  });

  startButton.addEventListener('click', () => {
    // reset progress bar
    const progressBars = document.querySelectorAll('progress');
    const processText = document.querySelectorAll('.progressText');

    progressBars.forEach((progressBar) => {
      progressBar.value = 0;
    });
    processText.forEach((progressText) => {
      progressText.textContent = '0%';
    });

    // Show loading
    document.getElementById('loading').style.display = 'block';

    const videoUrls = Array.from(document.querySelectorAll('.selectCheckbox')).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.dataset.url);
    quality.value = filter.value === 'mergevideo' ? quality.value : 'highest';
    videoUrls.forEach((url) => {
      window.api.downloadVideo(url, filter.value, quality.value, pathButton.value);
    });
    // Hide loading
    document.getElementById('loading').style.display = 'none';
  });
}

function displayVideoProgress() {
  window.api.onDownloadProgress(({ url, progress }) => {
    const row = document.querySelector(`.selectCheckbox[data-url="${url}"]`)?.closest('tr');

    if (row) {
      const progressBar = row.querySelector('progress');
      const progressText = row.querySelector('.progressText');
      const speedText = row.querySelector('.speedText');
      const etaText = row.querySelector('.etaText');

      if (progressBar) progressBar.value = progress.percentage;
      if (progressText) progressText.textContent = `${Math.floor(progress.percentage)}%`;
      if (speedText) speedText.textContent = progress.speed_str;
      if (etaText) etaText.textContent = progress.eta_str;
    }
  });
}

function setupCancelButton() {
  const cancelButton = document.getElementById('cancelButton');
  cancelButton.addEventListener('click', () => {
    window.api.cancelDownload();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupFetchButton();
  setupVideoCongfiguration();
  displayVideoProgress();
});