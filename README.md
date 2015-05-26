Neighborhood Map Project
========================

![Alt text](/screenshots/neighborhoodmapscreenshot.png?raw=true "Screenshot")

This project uses Google Maps API and Wikipedia's API to present a local map of my city with some preselected areas of interest.

# Usage
The project is pre-built and all files are in the dist/ folder.
You can double click on dist/index.html to load the app locally,
or you can point your web server, such as LAMP, at dist/ to run the app from a server.

# Node Web Server
If you have node installed, and you want to serve the files without installing a web server run:

    npm install

Then:

    node webServer

To start a node based web server right from the cloned source!
Then point your browser at http://localhost:8080 to see the app.

# Build

To rebuild the project yourself from scratch run:

    npm install
    gulp

# Site Usage
You can click on an entry in the list,
or click on a marker,
or type in the text box to search the list.

Not all articles result in hits from Wikipedia. I left them as is as an example of dealing with failed searches. However, in an expanded version it would be better to look up failed searches in another online system.
