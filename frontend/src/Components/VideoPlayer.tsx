import { MediaPlayer, MediaOutlet, MediaCaptions } from '@vidstack/react';
import { MediaPlayerElement } from 'vidstack';

type VideoPlayerProps = {
    lecture: {
        video_url: string;
        subtitle: string;
    };
    player: React.RefObject<MediaPlayerElement>;
};

export const VideoPlayer = ({ lecture, player }: VideoPlayerProps) => (
  <MediaPlayer
    aspectRatio={16 / 9}
    ref={player}
    load="custom"
    src={lecture.video_url}
    textTracks={[
      {
        src: lecture.subtitle,
        type: 'srt',
        kind: 'captions',
        label: 'English',
        language: 'en-US',
        default: true,
      },
    ]}
    controls
  >
    <MediaOutlet />
    <MediaCaptions />
  </MediaPlayer>
);
