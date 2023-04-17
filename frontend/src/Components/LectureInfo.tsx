import { Tabs } from '@mantine/core';
import { IconTextCaption, IconBrandOpenai, IconNote } from '@tabler/icons-react';
import { Notes } from './Notes';
import { ScrollableText } from './ScrollableText';

type LectureInfoProps = {
    lecture: {
        transcript: string;
        summary: string;
    };
};

export const LectureInfo = ({ lecture }: LectureInfoProps) => (
  <Tabs variant="outline">
    <Tabs.List defaultValue="transcript">
      <Tabs.Tab value="transcript" icon={<IconTextCaption size="14px" />}>
        Transcript
      </Tabs.Tab>
      <Tabs.Tab value="summary" icon={<IconBrandOpenai size="14px" />}>
        Summary
      </Tabs.Tab>
      <Tabs.Tab value="notes" icon={<IconNote size="14px" />}>
        Notes
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="transcript">
      <ScrollableText text={lecture.transcript} />
    </Tabs.Panel>
    <Tabs.Panel value="summary">
      <ScrollableText text={lecture.summary} />
    </Tabs.Panel>
    <Tabs.Panel value="notes">
      <Notes />
    </Tabs.Panel>
  </Tabs>
);
