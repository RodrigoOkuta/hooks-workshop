import React, { useRef, useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

import styles from './MemeCreator.module.css';
import memeTemplates from './memeTemplates.json';

const MemeCreator = () => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [meme, setMeme] = useState(memeTemplates[0].value);

  const onCaptionInput = event => {
    // this.setState({ caption: event.target.value });
    setCaption(event.target.value);
  };

  const onMemeSelect = event => {
    // this.setState({ meme: event.target.value });
    setMeme(event.target.value);
  };

  const downloadMeme = async () => {
    const canvas = canvasRef.current;
    const blob = await new Promise(resolve => canvas.toBlob(resolve));
    saveAs(blob, 'meme.png');
  };

  useEffect(() => {
    const loadMemeTemplate = async memeValue => {
      const template = memeTemplates.find(template => template.value === memeValue);
      const img = new window.Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = process.env.PUBLIC_URL + template.path;
      });

      setImage(img);
    };

    loadMemeTemplate(meme);
  }, [meme]);

  useEffect(() => {
    const drawCanvas = (image, caption) => {
      const { height, width } = image;
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0);
      ctx.font = '40px sans-serif';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(caption, width * 0.5, height * 0.15);
      ctx.strokeText(caption, width * 0.5, height * 0.15);
    };

    if (image) drawCanvas(image, caption);
  }, [caption, image]);

  return (
    <main className={styles.root}>
      <label className={styles.label}>
        Select a meme template <br />
        <select value={meme} onChange={onMemeSelect} className={styles.select}>
          {memeTemplates.map(template => (
            <option key={template.value} value={template.value}>
              {template.text}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Enter your meme caption <br />
        <input type="text" value={caption} onChange={onCaptionInput} className={styles.input} />
      </label>
      <canvas ref={canvasRef} className={styles.canvas} />
      <button onClick={downloadMeme} className={styles.btn}>
        Download
      </button>
    </main>
  );
};

export default MemeCreator;
