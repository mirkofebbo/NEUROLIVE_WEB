// Function to fetch a list of files (assuming your server provides such an endpoint)
async function fetchFileList() {
    const response = await fetch('http://localhost:3001/static');
    const fileList = await response.json();
    return fileList;
}

// Function to download a file
function downloadFile(filename) {
    window.location.href = `http://localhost:3001/download/${filename}`;
}
