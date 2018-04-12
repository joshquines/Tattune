// FUNCTIONS 

// UPLOAD THE AUDIO FILE HERE

function download(){
    let a = document.body.appendChild(
        document.createElement("a")
    );

    let audioFile = document.getElementById("audioFileUpload");
    for (let i = 0; i < audioFile.files.length; i++) {
        let file = audioFile.files[i];
        if ('name' in file) {
            fileName = file.name;
            fileName = fileName.slice(0, -4)
    a.download = fileName;
    let elements = document.getElementById("waveform").children;
    let txt = "";
    for (let i = 0; i < elements.length; i++){
        txt += "counter: " + i + elements[i] + "<br>";
        document.getElementById("yo").innerHTML = txt;
    }
    a.href = "data:text/html," + document.getElementById("waveform").children;
    a.click();
        }
    }
}

function uploadFile(){

    let wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'red',
        progressColor: 'purple',
        responsive: 'true',
      });
    let waver = wavesurfer;
    let txt = "";

    // Taken from: https://www.w3schools.com/jsref/prop_fileupload_files.asp
    let audioFile = document.getElementById("audioFileUpload");
    document.getElementById("uploadResponse").innerHTML = txt;
    txt += "I uploaded stuff2";
    document.getElementById("uploadResponse").innerHTML = txt;

    // Limit File Size
    txt += "I'm bout to do shit";
    document.getElementById("uploadResponse").innerHTML = txt;
    let fileType = audioFile.files[0].type;
    txt += fileType;
    document.getElementById("uploadResponse").innerHTML = txt;


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
                txt += "<br><strong>" + (i+1) + ". file</strong><br>";
                let file = audioFile.files[i];
                if ('name' in file) {
                    // txt += "name: " + file.name + "<br>";
                    fileName = file.name;
                    txt += fileName;
                    document.getElementById("uploadResponse").innerHTML = txt;
                }
                if ('size' in file) {

                    // Check if filesize over 10MB 
                    if (file.size > 10000000){
                        txt += "Filesize: " + file.size + " bytes is too large. <br>";
                        document.getElementById("uploadResponse").innerHTML = txt;
                        // Terminate Script, Redirect

                    } 
                    else{

                        // 

                        txt += "Upload of " + fileName + " was successful";
                        txt += audioFile;
                        document.getElementById ("uploadResponse").innerHTML = txt;

                        // RENDER THE AUDIO FILE HERE

                        // This Reads the File
                        let reader = new FileReader();
                        //reader.onload = loadedCallback;
                        //let fileContent = reader.readAsDataURL(audioFile);
                        let fileContent = URL.createObjectURL(audioFile.files[0]);

                        // This creates the waveform
                        let waveformImage = wavesurfer.load(fileContent);


                        let elements = document.getElementById("waveform").children;
                        let txts = "";
                        for (let i = 0; i < elements.length; i++){
                            txt += "counter: " + i + elements[i] + "<br>";
                            document.getElementById("yo").innerHTML = txts;
                        }



                        // Download Waveform Button
                        // Container is #waveform
                        let imageFile = html2canvas(document.querySelector("#waveform")).then(canvas => {
                            document.body.appendChild(canvas)
                        });


                    }
                }
            }
        }
    } 
}

