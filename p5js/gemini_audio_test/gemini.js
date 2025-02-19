// let API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// async function generateContent(prompt, model = "gemini-1.5-pro") {
//   let REQUEST_URL = `${API_URL}/${model}:generateContent?key=${GOOGLE_API_KEY}`;

//   let res = await fetch(REQUEST_URL, {
//     method: "POST",
//     body: JSON.stringify({
//       contents: [ prompt ],
//     }),
//     headers: {
//       "Content-type": "application/json; charset=UTF-8",
//     },
//   });
//   let json = await res.json();
//   return json.candidates[0].content.parts[0].text;
// }


//------Test with AI code -------//


let API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

async function generateAudioTranscription(audioFilePath) {
  // Prepare the file data (we'll refer to the file path directly in the browser)
  const formData = new FormData();

  // Since we are using local files in the same directory, we need to fetch them as blob
  const audioFile = await fetch(audioFilePath)
    .then(response => response.blob())
    .then(blob => blob);

  formData.append("audio", audioFile);  // Append the audio file

  // Prepare the contents and send it to the Gemini API
  const contents = {
    parts: [
      { text: "Transcribe this audio file." }, // Instruction for the transcription
      { inline_data: { mime_type: "audio/flac", data: await encodeFile(audioFile) } }
    ]
  };

  // Define the request URL
  let REQUEST_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GOOGLE_API_KEY}`;

  // Send the request to the Gemini API
  const response = await fetch(REQUEST_URL, {
    method: "POST",
    body: JSON.stringify({ contents: contents }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });

  // Parse the response
  const data = await response.json();
  if (data.error) {
    console.error("Error in transcription:", data.error);
    return "Error during transcription.";
  } else {
    return data.candidates[0].content.parts[0].text;  // Return the transcription text
  }
}

// Helper function to encode files to base64
function encodeFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);  // Base64-encoded content
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}