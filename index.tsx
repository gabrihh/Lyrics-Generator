import { Composition, CalculateMetadataFunction, registerRoot } from 'remotion';
import { MyVideo } from './video';

type Props = {
  title: string;
  author: string;
  backgroundColor?: string;
  logoUrl?: string;
  lyrics: {
    segments: Array<{ start: number; end: number; text: string }>;
    duration: number;
  };
};

const calculateMetadata: CalculateMetadataFunction<Props> = ({ props }) => {
  const durationInSeconds = props.lyrics?.duration || 30;
  const fps = 30;
  return {
    durationInFrames: Math.ceil(durationInSeconds * fps),
    fps,
    width: 720,
    height: 1280,
  };
};

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={900}
    fps={30}
    width={720}
    height={1280}
    defaultProps={{
      title: 'Title',
      author: 'Author',
      backgroundColor: '#0a0a2e',
      logoUrl: '',
      lyrics: { segments: [], duration: 30 },
    }}
    calculateMetadata={calculateMetadata}
  />
);

registerRoot(RemotionRoot);
