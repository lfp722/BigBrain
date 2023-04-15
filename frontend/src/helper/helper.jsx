const url = 'http://localhost:5005';

export default function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export default async function createID (questionId) {
  let id = Math.floor(100000 + Math.random() * 900000);
  try {
    const response = await fetch(url + `/admin/quiz/${questionId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      alert(response.status);
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    let questions = data.questions;
    questions.forEach(q => {
      if (q.id === id) {
        createID(questionId)
      }
    })
    return id;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}