// FUNCTIONS 

function loadWave() {
    document.getElementById("op").innerHTML='<object type="text/html" data="fileHandlerTest.html" ></object>';
}

function download(){

    let waveimg = document.getElementById("waveform");
    let img = null; 
    let imageFile = html2canvas(waveimg,{
       allowTaint: true
    }).then(canvas => {
        console.log("html2canvas");
        imgURL = canvas.toDataURL("image/png");
        img = document.createElement("img");
        img.src = imgURL;
        document.body.appendChild(img);
  
      let audioFile = document.getElementById("audioFileUpload");
      for (let i = 0; i < audioFile.files.length; i++) {
          let file = audioFile.files[i];
          if ('name' in file) {
              fileName = file.name;
              fileName = fileName.slice(0, -4)
          }
      }
      let a = document.body.appendChild(
        document.createElement("a")
      );
      a.download = fileName;
      a.href = img.src;
      a.click();

      // img.src is the actual file
      // Store img.src here into the DB

    });
}

function uploadFile(){

    let wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'green',
        progressColor: 'purple',
        responsive: 'false',
        barWidth: '1',
        scrollParent: 'true'
      });
    let waver = wavesurfer;
    let txt = "";

    // Taken from: https://www.w3schools.com/jsref/prop_fileupload_files.asp
    let audioFile = document.getElementById("audioFileUpload");

    // Limit File Size
    let fileType = audioFile.files[0].type;

    if ('files' in audioFile) {
        if (audioFile.files.length == 0) {
            txt = "Select one or more files.";
            document.getElementById("uploadResponse").innerHTML = "Select one or more files.";
            // Terminate script, Redirect

        } else if (audioFile.files.length > 1){
            txt = "Please only select 1 file";
            document.getElementById("uploadResponse").innerHTML = "Please only select 1 file";
            // Terminate Script, Redirect

        } else if (!(fileType.indexOf('audio') != -1)){
            txt += "Needs to be audio bitch";
            document.getElementById("uploadResponse").innerHTML = txt;
        }else {
            for (let i = 0; i < audioFile.files.length; i++) {
                let file = audioFile.files[i];
                if ('name' in file) {
                    // txt += "name: " + file.name + "<br>";
                    fileName = file.name;
                }
                if ('size' in file) {

                    // Check if filesize over 10MB 
                    if (file.size > 10000000){
                        txt += "Filesize: " + file.size + " bytes is too large. <br>";
                        document.getElementById("uploadResponse").innerHTML = txt;
                        // Terminate Script, Redirect

                    } 
                    else{

                        // Success Message to HTML Page
                        txt += "Upload of " + fileName + " was successful";
                        document.getElementById ("uploadResponse").innerHTML = txt;

                        // RENDER THE AUDIO FILE HERE
                        // This Reads the File
                        let reader = new FileReader();
                        let fileContent = URL.createObjectURL(audioFile.files[0]);

                        // This creates the waveform
                        let waveformImage = wavesurfer.load(fileContent);

                        // Download Waveform Button
                        // Container is #waveform
                        let imageFile = html2canvas(document.querySelector("div > wave > canvas")).then(canvas => {
                            document.body.appendChild(canvas)
                        });
                    }
                }
            }
        }
    } 
}

