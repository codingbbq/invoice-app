import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#2563eb',
          borderRadius: '112px',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '42px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: '330px',
            padding: '48px 44px',
            position: 'relative',
            width: '288px',
          }}
        >
          <div
            style={{
              background: '#dbeafe',
              borderRadius: '20px',
              display: 'flex',
              height: '42px',
              width: '100%',
            }}
          />
          <div
            style={{
              background: '#2563eb',
              borderRadius: '10px',
              display: 'flex',
              height: '20px',
              width: '118px',
            }}
          />
          <div
            style={{
              background: '#93c5fd',
              borderRadius: '10px',
              display: 'flex',
              height: '20px',
              width: '82px',
            }}
          />
          <div
            style={{
              background: '#93c5fd',
              borderRadius: '10px',
              display: 'flex',
              height: '20px',
              width: '56px',
            }}
          />
          <div
            style={{
              alignItems: 'center',
              background: '#2563eb',
              borderRadius: '16px',
              color: 'white',
              display: 'flex',
              fontSize: '42px',
              fontWeight: 700,
              height: '58px',
              justifyContent: 'center',
              position: 'absolute',
              right: '44px',
              top: '208px',
              width: '58px',
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
