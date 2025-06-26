const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const transcriptionBox = document.getElementById("transcription");

let mediaRecorder;
let audioChunks = [];

startBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const arrayBuffer = await audioBlob.arrayBuffer();

    const response = await fetch("https://api.deepgram.com/v1/listen", {
      method: "POST",
      headers: {
        "Authorization": "Token YOUR_DEEPGRAM_API_KEY",
        "Content-Type": "audio/wav"
      },
      body: arrayBuffer
    });

    const data = await response.json();
    const transcript = data.results.channels[0].alternatives[0].transcript;
    transcriptionBox.textContent = transcript || "(No transcription found)";
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
};
