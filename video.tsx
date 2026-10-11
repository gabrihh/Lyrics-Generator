import { AbsoluteFill, Img, useVideoConfig, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

const SAFE = 60;
const FADE_DURATION = 0.4;

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

  const currentTime = frame / fps;

  const activeIndex = lyrics.segments.findIndex(
    (seg) => currentTime >= seg.start && currentTime < seg.end
  );

  const currentSegment = lyrics.segments[activeIndex];

  const isNearEnd = currentSegment
    ? currentTime > currentSegment.end - FADE_DURATION
    : false;

  const activeProgress = currentSegment
    ? isNearEnd
      ? interpolate(
          currentTime,
          [currentSegment.end - FADE_DURATION, currentSegment.end],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
        )
      : interpolate(
          currentTime,
          [currentSegment.start, currentSegment.start + FADE_DURATION],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
        )
    : 0;

  const activeScale = interpolate(activeProgress, [0, 1], [1.15, 1]);
  const activeOpacity = activeProgress;
  const activeBlur = interpolate(activeProgress, [0, 1], [6, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: backgroundColor || '#0a0a2e', fontFamily }}>
      <AbsoluteFill
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          padding: SAFE,
        }}
      >
        <p style={{ color: '#fff', fontSize: 36, fontWeight: 700, margin: 0 }}>
          {title}
        </p>
        <p style={{ color: '#aaa', fontSize: 28, fontWeight: 400, margin: 0 }}>
          {author}
        </p>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          padding: SAFE,
          paddingBottom: SAFE * 2,
        }}
      >
        {lyrics.segments.map((segment, index) => {
          const distance = index - activeIndex;
          const isPast = index < activeIndex;
          const isActive = index === activeIndex;
          const isFuture = index > activeIndex;

          if (isPast) return null;

          let opacity = 0.25;
          let fontSize = 44;
          let color = '#aaa';
          let fontWeight = 400;
          let scale = 1;
          let blur = 0;
          let translateX = 0;

          if (isActive) {
            opacity = activeOpacity;
            fontSize = 64;
            color = '#fff';
            fontWeight = 700;
            scale = activeScale;
            blur = activeBlur;
            translateX = interpolate(activeProgress, [0, 1], [20, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
          } else if (isFuture) {
            opacity = Math.max(0.15, 0.6 - distance * 0.12);
            fontSize = 44;
            color = '#aaa';
            fontWeight = 400;

            const timeUntilActive = segment.start - currentTime;
            const approachProgress = interpolate(
              timeUntilActive,
              [0, 1.5],
              [1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            fontSize = interpolate(approachProgress, [0, 1], [44, 52]);
            opacity = interpolate(approachProgress, [0, 1], [opacity, 0.8]);
            translateX = interpolate(approachProgress, [0, 1], [0, -8]);
          }

          return (
            <div
              key={index}
              style={{
                opacity,
                fontSize,
                fontWeight,
                color,
                marginBottom: 16,
                lineHeight: 1.2,
                transform: `scale(${scale}) translateX(${translateX}px)`,
                transformOrigin: 'left center',
                filter: blur > 0 ? `blur(${blur}px)` : 'none',
              }}
            >
              {segment.text}
            </div>
          );
        })}
      </AbsoluteFill>

      {logoUrl && (
        <Img
          src={logoUrl}
          style={{
            position: 'absolute',
            bottom: SAFE,
            right: SAFE,
            width: 120,
            height: 120,
            objectFit: 'contain',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
