import { AbsoluteFill, Img, Audio, Sequence, useVideoConfig, useCurrentFrame } from 'remotion';

type LyricsSegment = {
  start: number;
  end: number;
  text: string;
};

type Props = {
  title: string;
  author: string;
  backgroundColor?: string;
  logoUrl?: string;
  lyrics: { segments: LyricsSegment[] };
};

export const MyVideo = ({ title, author, backgroundColor, logoUrl, lyrics }: Props) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: backgroundColor || '#0a0a2e' }}>
      {logoUrl && (
        <Img
          src={logoUrl}
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: 120,
            height: 120,
            objectFit: 'contain',
          }}
        />
      )}

      {lyrics.segments.map((segment, index) => {
        // Converte o tempo (segundos) para frames
        const startFrame = Math.round(segment.start * fps);
        const endFrame = Math.round(segment.end * fps);
        const duration = endFrame - startFrame;

        return (
          <Sequence key={index} from={startFrame} durationInFrames={duration}>
            <AbsoluteFill
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 60,
              }}
            >
              <h1 style={{ color: '#fff', fontSize: 72, textAlign: 'center' }}>
                {segment.text}
              </h1>
            </AbsoluteFill>
          </Sequence>
        );
      })}

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 60,
        }}
      >
        <p style={{ color: '#aaa', fontSize: 36 }}>{title}</p>
        <p style={{ color: '#888', fontSize: 28 }}>{author}</p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
