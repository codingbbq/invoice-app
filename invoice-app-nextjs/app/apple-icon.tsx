import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#2563eb',
          borderRadius: '40px',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            height: '118px',
            padding: '18px 16px',
            position: 'relative',
            width: '102px',
          }}
        >
          <div
            style={{
              background: '#dbeafe',
              borderRadius: '8px',
              display: 'flex',
              height: '16px',
              width: '100%',
            }}
          />
          <div
            style={{
              background: '#2563eb',
              borderRadius: '6px',
              display: 'flex',
              height: '10px',
              width: '42px',
            }}
          />
          <div
            style={{
              background: '#93c5fd',
              borderRadius: '6px',
              display: 'flex',
              height: '10px',
              width: '30px',
            }}
          />
          <div
            style={{
              alignItems: 'center',
              background: '#2563eb',
              borderRadius: '10px',
              color: 'white',
              display: 'flex',
              fontSize: '18px',
              fontWeight: 700,
              height: '26px',
              justifyContent: 'center',
              position: 'absolute',
              right: '16px',
              top: '68px',
              width: '26px',
            }}
          >
            ₹
          </div>
        </div>
      </div>
    ),
    size
  );
}
