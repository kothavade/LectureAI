import os
import sqlite3
import tempfile
from typing import Tuple

import ffmpeg
import openai
import whisper
from fastapi import BackgroundTasks, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, BaseSettings, Field
from whisper.utils import WriteSRT


class Settings(BaseSettings):
    openai_api_key: str

    class Config:
        env_file = ".env"


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = sqlite3.connect("lectures.db")
c = conn.cursor()
c.execute(
    """
    CREATE TABLE IF NOT EXISTS lectures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_url TEXT NOT NULL,
        transcript TEXT,
        summary TEXT,
        subtitle BLOB
    )
"""
)
conn.commit()
conn.close()

model = whisper.load_model("tiny.en")
openai.api_key = Settings().openai_api_key

class Lecture(BaseModel):
    video_url: str
    transcript: str | None = Field(None, alias="transcript")
    summary: str | None = Field(None, alias="summary")
    subtitle: bytes | None = Field(None, alias="subtitle")


def get_whisper(video_url: str) -> Tuple[str, bytes]:
    video_name = video_url.split("/")[-1]
    video_name = video_name.split(".")[0]

    wav_path = f"{tempfile.gettempdir()}/{video_name}.wav"
    (ffmpeg.input(video_url).output(wav_path).run(cmd=["ffmpeg", "-nostdin"], capture_stdout=True, capture_stderr=True))

    result = model.transcribe(wav_path)
    writer = WriteSRT(output_dir=tempfile.gettempdir())
    srt_path = f"{tempfile.gettempdir()}/{video_name}.srt"
    srt_file = open(srt_path, "w")
    writer.write_result(result, srt_file)
    subtitle = open(srt_path, "rb").read()
    transcript = result["text"]
    return subtitle, transcript


def get_summary(transcript: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a summary bot. You will be given a transcript of a lecture and you will write at least 10 bullet points about what was said.",
            },
            {
                "role": "user",
                "content": transcript,
            },
        ],
    )
    summary = response.choices[0].message.content
    return summary


async def process_lecture(lecture: Lecture, lecture_id: int):
    video_url = lecture.video_url
    (
        subtitle,
        transcript,
    ) = get_whisper(video_url)
    subtitle = sqlite3.Binary(subtitle)
    summary = get_summary(transcript)
    conn = sqlite3.connect("lectures.db")
    c = conn.cursor()
    c.execute(
        """
        UPDATE lectures SET transcript=?, summary=?, subtitle=? WHERE id=?
    """,
        (transcript, summary, subtitle, lecture_id),
    )
    conn.commit()
    conn.close()


@app.post("/upload_lecture/")
async def upload_lecture(lecture: Lecture, background_tasks: BackgroundTasks):
    video_url = lecture.video_url
    video_name = video_url.split("/")[-1]
    video_path = os.path.join(tempfile.gettempdir(), video_name)
    conn = sqlite3.connect("lectures.db")
    c = conn.cursor()
    # TODO: better caching
    in_db = c.execute(
        """
        SELECT COUNT(*) FROM lectures WHERE video_url=?
    """,
        (video_url,),
    ).fetchone()[0]
    if not os.path.exists(video_path) and not in_db:
        os.system(f"wget -O {video_path} {video_url}")
        c.execute(
            """
            INSERT INTO lectures (video_url) VALUES (?)
        """,
            (video_url,),
        )
        lecture_id = c.lastrowid
        conn.commit()
        conn.close()

        background_tasks.add_task(process_lecture, lecture, lecture_id)
    else:
        c.execute(
            """
            SELECT id FROM lectures WHERE video_url=?
        """,
            (video_url,),
        )
        lecture_id = c.fetchone()[0]
        conn.close()

    return {"lecture_id": lecture_id}


@app.get("/lecture/{lecture_id}")
async def get_lecture_info(lecture_id: int):
    conn = sqlite3.connect("lectures.db")
    c = conn.cursor()
    c.execute(
        """
        SELECT video_url, transcript, summary FROM lectures WHERE id=?
    """,
        (lecture_id,),
    )
    result = c.fetchone()
    conn.close()

    if result:
        video_url, transcript, summary = result
        return {"id": lecture_id, "video_url": video_url, "transcript": transcript, "summary": summary}
    else:
        return {"detail": "Lecture not found"}


@app.get("/lecture/{lecture_id}/subtitle.srt")
async def get_lecture_subtitle(lecture_id: int):
    conn = sqlite3.connect("lectures.db")
    c = conn.cursor()
    c.execute(
        """
        SELECT subtitle FROM lectures WHERE id=?
    """,
        (lecture_id,),
    )
    result = c.fetchone()
    conn.close()

    if result:
        subtitle_blob = result[0]
        return Response(content=subtitle_blob, media_type="text/plain")
    else:
        return {"detail": "Lecture not found"}
