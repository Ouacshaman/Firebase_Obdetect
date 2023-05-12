// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel

    const URL = "https://teachablemachine.withgoogle.com/models/VLm-g8q0K/";

    let model, webcam, labelContainer, maxPredictions;

    const shi_name_audio = new Audio();
    shi_name_audio.autoplay = true;
    shi_name_audio.src = "Shi.mp3";

    const bottle_audio = new Audio();
    bottle_audio.autoplay = true;
    bottle_audio.src="Bottle.mp3";

    const sodacan_audio = new Audio();
    sodacan_audio.autoplay = true;
    sodacan_audio.src="can_soda.mp3";

    const car_audio = new Audio();
    car_audio.autoplay = true;
    car_audio.src="car.mp3";

    const iphone_audio = new Audio();
    iphone_audio.autoplay = true;
    iphone_audio.src="Iphone.mp3";

    const sit_audio = new Audio();
    sit_audio.autoplay = true;
    sit_audio.src="sit.mp3"

    let isIos = false; 
    // fix when running demo in ios, video will be frozen;
    if (window.navigator.userAgent.indexOf('iPhone') > -1 || window.navigator.userAgent.indexOf('iPad') > -1) {
      isIos = true;
    }

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        const width = 480;
        const height = 320;
        webcam = new tmImage.Webcam(width, height, flip);
        await webcam.setup({facingMode: "environment"}); // request access to the webcam

        // append elements to the DOM
        if (isIos) {
            document.getElementById('webcam-container').appendChild(webcam.webcam); // webcam object needs to be added in any case to make this work on iOS
            // grab video-object in any way you want and set the attributes
            const webCamVideo = document.getElementsByTagName('video')[0];
            webCamVideo.setAttribute("playsinline", true); // written with "setAttribute" bc. iOS buggs otherwise
            webCamVideo.muted = "true";
            webCamVideo.style.width = width + 'px';
            webCamVideo.style.height = height + 'px';
        } else {
            document.getElementById("webcam-container").appendChild(webcam.canvas);
        }
        // append elements to the DOM
        labelContainer = document.getElementById('label-container');
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            let el = document.createElement("div")
            el.className = 'prediction-bar'
                labelContainer.appendChild(el);
      
        }
        webcam.play();
        window.requestAnimationFrame(loop);
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        let prediction;
        if (isIos) {
            prediction = await model.predict(webcam.webcam);
        } else {
            prediction = await model.predict(webcam.canvas);
        }
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
                if (prediction[i].probability>=.80 && prediction[i].className=='Shi'){
                    document.getElementById("message").innerHTML = "Shi";
                }
                else if(prediction[i].probability>=.80 && prediction[i].className=='bottle'){
                    document.getElementById("message").innerHTML = "Bottle";
                }
                else if(prediction[i].probability>=.80 && prediction[i].className=='soda'){
                    document.getElementById("message").innerHTML = "soda";
                }
                else if(prediction[i].probability>=.80 && prediction[i].className=='iphone'){
                    document.getElementById("message").innerHTML = "iphone";
                }
                else if(prediction[i].probability>=.80 && prediction[i].className=='chair'){
                    document.getElementById("message").innerHTML = "chair";
                }
                else if(prediction[i].probability>=.80 && prediction[i].className=='car'){
                    document.getElementById("message").innerHTML = "car";
                }
            labelContainer.childNodes[i].innerHTML = `
            <div class="name-progress">${classPrediction}</div>
              <div class="progress">
                <div class="inner-progress" style="width:${prediction[i].probability.toFixed(2)*100}%">${prediction[i].probability.toFixed(2)*100}%
               </div>
            </div>`;
        }
    }

    async function identify(){
        if(document.getElementById("message").innerHTML=="Shi"){
            console.log("Shi")
            shi_name_audio.play();
        }
        else if(document.getElementById("message").innerHTML=="Bottle"){
            console.log("Bottle")
            bottle_audio.play();
        }
        else if(document.getElementById("message").innerHTML=="soda"){
            console.log("soda")
            sodacan_audio.play();
        }
        else if(document.getElementById("message").innerHTML=="iphone"){
            console.log("iphone")
            iphone_audio.play();
        }
        else if(document.getElementById("message").innerHTML=="chair"){
            console.log("chair")
            sit_audio.play();
        }
        else if(document.getElementById("message").innerHTML=="car"){
            console.log("car")
            car_audio.play();
        }
    }

