# Lecture Assistant

A tool for quickly reviewing and taking notes on lectures.

## Installation

```bash
$ git clone
$ cd lecture-assistant
# Frontend
$ cd frontend
$ pnpm install # or npm / yarn
$ pnpm run dev

# Backend
$ cd backend
$ poetry install
$ poetry run uvicorn main:app --reload
```

## Features

- Transcribe and generate subtitles for a lecture
- Summarize the lecture with ChatGPT
- Allow you to take notes on the lecture with a WYSIWYG rich text editor

## Screenshots

<details>
<summary>Click to expand</summary>

![Transcript](./assets/transcript.jpg) ![Summary](./assets/summary.jpg)
![Notes](./assets/notes.jpg)

</details>

<!--
## Demo

<details>
<summary>Click to expand</summary>

[![Youtube Demo](https://img.youtube.com/vi/9S9kFVsikUU/0.jpg)](https://www.youtube.com/watch?v=9S9kFVsikUU)

Click on the image to watch the demo on Youtube.

</details>

-->

## Tech

- Backend:
  - [FastAPI](https://fastapi.tiangolo.com/)
  - [Whisper](https://github.com/openai/whisper)
  - [OpenAI ChatGPT API](https://platform.openai.com/docs/introduction)
  - [FFMPEG](https://ffmpeg.org/)
  - [SQLite](https://www.sqlite.org/index.html)
- Frontend
  - [React](https://react.dev/)
  - [Mantine](https://mantine.dev/)
  - [Vidstack](https://vidstack.io/)
