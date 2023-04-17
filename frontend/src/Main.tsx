import { Button, Grid, Group, TextInput } from '@mantine/core';
import { useState, useRef } from 'react';
import { MediaPlayerElement } from 'vidstack';
import 'vidstack/styles/defaults.css';
import { Titlebar } from './Components/Titlebar';
import { LectureInfo } from './Components/LectureInfo';
import { VideoPlayer } from './Components/VideoPlayer';

export const Main = () => {
  const [lecture, setLecture] = useState({
    id: null,
    video_url: '',
    summary: 'Loading...',
    transcript: 'Loading...',
    subtitle: 'Loading...',
  });

  const player = useRef<MediaPlayerElement>(null);

  const loadLecture = async (url: string) => {
    await fetch('http://localhost:8000/upload_lecture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_url: url }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(`http://localhost:8000/lecture/${data.lecture_id}`)
          .then((response) => response.json())
          .then((response) => {
            setLecture({
              ...response,
              subtitle: `http://localhost:8000/lecture/${response.id}/subtitle.srt`,
            });
          })
          .then(() => {
            document.title = url.split('/').pop()?.split('.').shift() || 'Lecture Assistant';
            player.current!.startLoading();
          });
      });
  };

  return (
    <>
      <Titlebar />
      <Group grow mt="xl">
        <Grid gutter="xl" sx={{ margin: '0 20px' }}>
          <Grid.Col span={8}>
            <Group position="center" mt="xl" align="flex-end">
              <VideoPlayer lecture={lecture} player={player} />
              <TextInput placeholder="Enter new video url" label="Lecture URL" id="lecture-url" />
              <Button
                onClick={() => {
                  loadLecture((document.getElementById('lecture-url') as HTMLInputElement).value);
                }}
              >
                Load
              </Button>
            </Group>
          </Grid.Col>
          <Grid.Col span={4}>
            <LectureInfo lecture={lecture} />
          </Grid.Col>
        </Grid>
      </Group>
    </>
  );
};
