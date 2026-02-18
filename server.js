const http = require("http");
const fs = require("fs");
const path = require("path");

const STORAGE_DIR = path.join(__dirname, "storage");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  res.setHeader("Content-Type", "text/plain");

  // list files
  if (pathname === "/textfile-api/all") {
    fs.readdir(STORAGE_DIR, (err, files) => {
      if (err) return res.end("Error reading directory");
      const txtFiles = files.filter((f) => f.endsWith(".txt"));
      res.end(txtFiles.join("\n"));
    });
  }

  // create or overwrite existing files
  else if (pathname === "/textfile-api/new") {
    const filename = url.searchParams.get("filename");
    const data = url.searchParams.get("data");

    fs.writeFile(path.join(STORAGE_DIR, filename), data, (err) => {
      if (err) return res.end("Error creating file");
      res.end("File created/overwritten successfully");
    });
  }

  // read files
  else if (pathname === "/textfile-api/read") {
    const filename = url.searchParams.get("filename");

    fs.readFile(path.join(STORAGE_DIR, filename), "utf8", (err, data) => {
      if (err) return res.end("File not found");
      res.end(data);
    });
  }

  // delete files
  else if (pathname === "/textfile-api/remove") {
    const filename = url.searchParams.get("filename");

    fs.unlink(path.join(STORAGE_DIR, filename), (err) => {
      if (err) return res.end("Error deleting file");
      res.end("File deleted");
    });
  }

  // append to file
  else if (pathname === "/textfile-api/append") {
    const filename = url.searchParams.get("filename");
    const data = url.searchParams.get("data");

    fs.appendFile(path.join(STORAGE_DIR, filename), data, (err) => {
      if (err) return res.end("Error appending file");
      res.end("Data appended");
    });
  } 
  
  else if (pathname === "/") {
    fs.readFile("./public/webApp.html", (err, html) => {
      res.setHeader("Content-Type", "text/html");
      res.end(html);
    });
  } 
  
  else if (pathname === "/styles.css") {
    fs.readFile(path.join(__dirname, "public", "styles.css"), (err, css) => {
      if (err) {
        res.statusCode = 404;
        return res.end("CSS not found");
      }
      res.setHeader("Content-Type", "text/css");
      res.end(css);
    });
  } 
  
  else {
    res.end("Route not found");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
