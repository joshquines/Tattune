// FUNCTIONS 
let wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'red',
    progressColor: 'purple'
  });

// UPLOAD THE AUDIO FILE HERE
    // Taken from: https://www.w3schools.com/jsref/prop_fileupload_files.asp
    let audioFile = document.getElementById("audioFile");

    // Limit File Size
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "Select one or more files.";
            document.getElementById ("uploadResponse").innerHTML = txt;
            // Terminate script, Redirect

        } else if (audioFile.files.length > 1){
            txt = "Please only select 1 file";
            document.getElementById ("uploadResponse").innerHTML = txt;
            // Terminate Script, Redirect

        } else {
            for (var i = 0; i < audioFile.files.length; i++) {
                txt += "<br><strong>" + (i+1) + ". file</strong><br>";
                var file = audioFile.files[i];
                if ('name' in file) {
                    // txt += "name: " + file.name + "<br>";
                    fileName = file.name;
                }
                if ('size' in file) {

                    // Check if filesize over 10MB 
                    if (file.size > 10000){
                        txt += "Filesize: " + file.size + " bytes is too large. <br>";
                        document.getElementById ("uploadResponse").innerHTML = txt;
                        // Terminate Script, Redirect

                    } 
                    else{
                        txt += "Upload of " + fileName + " was successful";
                    }
                }
            }
        }
    } 

    // Send response message to uploadResponse div or something. 
    document.getElementById ("uploadResponse").innerHTML = txt;


// RENDER THE AUDIO FILE HERE
wavesurfer.load(audioFile);

    // Download Waveform Button
    // Container is #waveform


//  THIS PART WILL PROBABLY JUST BE SPLIT INTO DIFFERENT FILES DEPENDING ON WHAT THE USER CHOOSES 

// SAVE WAVEFORM

    // STORE INTO DATABASE HERE

// DOWNLOAD WAVEFORM

    // SAVE FROM DIV 
    // STORE INTO DATABASE HERE 


// 