import { AbsoluteFill, Img, useVideoConfig, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

const SCALE = 1.5;

const SAFE = 60 * SCALE;
const TOP_OFFSET = SAFE * 4;
const FADE_DURATION = 0.6;
const MAX_FUTURE_LINES = 4;

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
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
        )
      : interpolate(
          currentTime,
          [currentSegment.start, currentSegment.start + FADE_DURATION],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
        )
    : 0;

  const activeScale = interpolate(activeProgress, [0, 1], [1.05, 1]);
  const activeOpacity = activeProgress;
  const activeBlur = interpolate(activeProgress, [0, 1], [3, 0]);
  const activeTranslateY = interpolate(activeProgress, [0, 1], [20 * SCALE, 0]);

  const bgColor = backgroundColor || '#0a0a2e';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, fontFamily }}>
      <AbsoluteFill
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingLeft: SAFE,
          paddingRight: SAFE,
          paddingTop: TOP_OFFSET,
          paddingBottom: SAFE,
        }}
      >
        <p
          style={{
            color: '#fff',
            fontSize: 36 * SCALE,
            fontWeight: 700,
            margin: 0,
            letterSpacing: -0.5 * SCALE,
            textShadow: `0 ${2 * SCALE}px ${12 * SCALE}px rgba(0,0,0,0.6)`,
          }}
        >
          {title}
        </p>
        <p
          style={{
            color: '#aaa',
            fontSize: 28 * SCALE,
            fontWeight: 400,
            margin: 0,
            letterSpacing: 0.3 * SCALE,
            textShadow: `0 ${2 * SCALE}px ${10 * SCALE}px rgba(0,0,0,0.5)`,
          }}
        >
          {author}
        </p>

        <div style={{ marginTop: SAFE * 2, width: '100%', position: 'relative' }}>
          {lyrics.segments.map((segment, index) => {
            const distance = index - activeIndex;
            const isPast = index < activeIndex;
            const isActive = index === activeIndex;
            const isFuture = index > activeIndex;

            if (isFuture && distance > MAX_FUTURE_LINES) return null;

            let opacity = 0.25;
            let fontSize = 28 * SCALE;
            let color = '#aaa';
            let fontWeight = 400;
            let scale = 1;
            let blur = 0;
            let translateX = 0;
            let translateY = 0;
            let textShadow = `0 ${2 * SCALE}px ${16 * SCALE}px rgba(0,0,0,0.7)`;
            let transform3d = '';

            if (isPast) {
              const timeSinceEnd = currentTime - segment.end;
              const exitProgress = interpolate(
                timeSinceEnd,
                [0, FADE_DURATION],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) }
              );

              opacity = interpolate(exitProgress, [0, 1], [1, 0]);
              translateY = interpolate(exitProgress, [0, 1], [0, -80 * SCALE]);
              blur = interpolate(exitProgress, [0, 1], [0, 6]);
              fontSize = 40 * SCALE;
              color = '#fff';
              fontWeight = 700;
              textShadow = `
                0 ${2 * SCALE}px 0 rgba(0,0,0,0.4),
                0 ${4 * SCALE}px ${8 * SCALE}px rgba(0,0,0,0.5),
                0 ${8 * SCALE}px ${24 * SCALE}px rgba(0,0,0,0.4)
              `;
            } else if (isActive) {
              opacity = activeOpacity;
              fontSize = 40 * SCALE;
              color = '#fff';
              fontWeight = 700;
              scale = activeScale;
              blur = activeBlur;
              translateX = interpolate(activeProgress, [0, 1], [12 * SCALE, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic),
              });
              translateY = activeTranslateY;
              textShadow = `
                0 ${1 * SCALE}px 0 rgba(0,0,0,0.3),
                0 ${2 * SCALE}px 0 rgba(0,0,0,0.4),
                0 ${3 * SCALE}px 0 rgba(0,0,0,0.3),
                0 ${6 * SCALE}px ${12 * SCALE}px rgba(0,0,0,0.6),
                0 ${12 * SCALE}px ${28 * SCALE}px rgba(0,0,0,0.5)
              `;
              transform3d = 'perspective(800px) rotateX(2deg)';
            } else if (isFuture) {
              opacity = Math.max(0.15, 0.5 - distance * 0.1);
              fontSize = 28 * SCALE;
              color = '#aaa';
              fontWeight = 400;
              textShadow = `0 ${1 * SCALE}px ${4 * SCALE}px rgba(0,0,0,0.5)`;

              const timeUntilActive = segment.start - currentTime;
              const approachProgress = interpolate(
                timeUntilActive,
                [0, 1.5],
                [1, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
              );

              fontSize = interpolate(approachProgress, [0, 1], [28 * SCALE, 33 * SCALE]);
              opacity = interpolate(approachProgress, [0, 1], [opacity, 0.7]);
              translateX = interpolate(approachProgress, [0, 1], [0, -4 * SCALE]);
            }

            if (opacity <= 0.01) return null;

            return (
              <div
                key={index}
                style={{
                  opacity,
                  fontSize,
                  fontWeight,
                  color,
                  marginBottom: 12 * SCALE,
                  lineHeight: 1.25,
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  transform: `${transform3d} scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                  transformOrigin: 'left center',
                  filter: blur > 0 ? `blur(${blur}px)` : 'none',
                  textShadow,
                  willChange: 'transform, opacity',
                }}
              >
                {segment.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          top: 0,
          height: TOP_OFFSET + 80 * SCALE,
          background: `linear-gradient(to bottom, transparent 0%, transparent ${TOP_OFFSET - 60 * SCALE}px, ${bgColor} ${TOP_OFFSET + 80 * SCALE}px)`,
          pointerEvents: 'none',
        }}
      />

      <AbsoluteFill
        style={{
          bottom: 0,
          height: SAFE * 4,
          background: `linear-gradient(to top, ${bgColor} 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      {logoUrl && (
        <div
          style={{
            position: 'absolute',
            bottom: SAFE * 3,
            right: SAFE,
            width: 120 * SCALE,
            height: 120 * SCALE,
            borderRadius: 12 * SCALE,
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: `drop-shadow(0 ${4 * SCALE}px ${12 * SCALE}px rgba(0,0,0,0.5))`,
          }}
        >
          <Img
            src={logoUrl}
            style={{
              width: '80%',
              height: '80%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
