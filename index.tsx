import { registerRoot, Composition } from 'remotion';
import { MyVideo } from './video';

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
      lyrics: { segments: [] },
    }}
  />
);

registerRoot(RemotionRoot);
