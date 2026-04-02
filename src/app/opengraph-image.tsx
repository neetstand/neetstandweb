import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'NEETStand - 30 Day Sprint to 650+';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617', // slate-950
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle top banner line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '16px',
            background: 'linear-gradient(to right, #0ea5e9, #4f46e5)'
          }}
        />

        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
            marginRight: '28px',
            color: 'white',
            fontSize: '56px',
            fontWeight: 800,
          }}>
            N
          </div>
          <span
            style={{
              fontSize: '96px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            NEETStand
          </span>
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          <span
            style={{
              fontSize: '52px',
              fontWeight: 700,
              color: '#38bdf8', // sky-400
              marginBottom: '24px',
            }}
          >
            We make NEET Prep Special!!
          </span>
          <span
            style={{
              fontSize: '36px',
              color: '#94a3b8', // slate-400
              maxWidth: '900px',
              lineHeight: 1.5,
              textAlign: 'center',
            }}
          >
            Master high-weightage topics, practice dynamically, and secure 650+ marks with the ultimate free study platform.
          </span>
        </div>

        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            padding: '16px 36px',
          }}
        >
          <span style={{ color: '#38bdf8', fontSize: '32px', marginRight: '16px' }}>⚡</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
