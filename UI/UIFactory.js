const { Menu, BrowserWindow } = require('electron');
const path = require('node:path')

function buildVideosTable(info, outputElement) {

  const table = document.createElement('table');
  table.id = 'videoTable';

  if (Array.isArray(info)) {
    // Playlist mode
    table.innerHTML = `
          <thead>
            <tr>
              <th>#</th>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            ${info.map((video, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>
                  <img src="${video.thumbnail}" alt="Thumbnail" class="thumbnail" />
                </td>
                <td>
                  <p><strong>${video.title}</strong></p>
                  <p><strong>Duration:</strong> ${video.duration}</p>
                  <progress id="progress-${index}" value="0" max="100"></progress>
                  <span class="progressText">0%</span>
                  <p>Speed: <span class="speedText">0kb/s</span></p>
                  <p>ETA: <span class="etaText">0s</span></p>
                </td>
                <td>
                  <input type="checkbox" checked  name="video-${index}" class="selectCheckbox" data-url="${video.url}"/>
                </td>
              </tr>
            `).join('')}
          </tbody>
        `;

  }
  else {
    // Single video mode
    table.innerHTML = `
        <thead>
          <tr>
            <th>#</th>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <img src="${info.thumbnail}" alt="Thumbnail" class="thumbnail" />
            </td>
            <td>
              <p><strong>${info.title}</strong></p>
              <p><strong>Duration:</strong> ${info.duration}</p>
              <p><strong>Size:</strong> ${info.size}</p>
              <progress value="0" max="100"></progress>
              <span class="progressText">0%</span>
              <p>Speed: <span class="speedText">0kb/s</span></p>
              <p>ETA: <span class="etaText">0s</span></p>
            </td>
            <td>
              <input type="checkbox" checked  name="video" class="selectCheckbox" data-url="${info.url}"/>
            </td>
          </tr>
        </tbody>
      `;
  }
  outputElement.appendChild(table);
}

function buildMenuBar() {
  const menuTemplate = [
 
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            const aboutWindow = new BrowserWindow({
              width: 500,
              height: 600,
              title: 'About',
              resizable: false,
              minimizable: false,
              maximizable: false,
              icon: path.join(__dirname, '..', 'assets', 'icon.png'),
              webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
              }
            });

            const aboutPath = path.join(__dirname, 'about.html');
            aboutWindow.loadFile(aboutPath);
          }
        }
      ]
    }
  ];

  const appMenu = Menu.buildFromTemplate(menuTemplate);

  return appMenu;
}

module.exports = { buildVideosTable, buildMenuBar };