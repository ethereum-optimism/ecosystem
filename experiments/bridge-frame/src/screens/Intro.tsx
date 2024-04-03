import { getScaled } from '@/util/getScaled'

export const Intro = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        backgroundImage:
          'url(https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/73811705-510d-462f-9629-aa8a67a41200/framesquare)',
        backgroundSize: 'cover',
        fontFamily: 'Sora',
        paddingTop: getScaled(80),
        paddingBottom: getScaled(80),
        paddingLeft: getScaled(40),
        paddingRight: getScaled(40),
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            textTransform: 'uppercase',
            fontWeight: 500,
            marginBottom: getScaled(40),
            fontSize: getScaled(28),
            lineHeight: `${getScaled(28)}px`,
          }}
        >
          Bridge to the
        </div>
        <div
          style={{
            display: 'flex',
            fontWeight: 700,
            fontSize: getScaled(68),
            lineHeight: `${getScaled(68)}px`,
          }}
        >
          Superchain
        </div>
      </div>
    </div>
  )
}
