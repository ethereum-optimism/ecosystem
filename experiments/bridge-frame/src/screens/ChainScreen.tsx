import { getScaled } from '@/util/getScaled'

export const ChainScreen = ({
  splashImageSrc,
  name,
}: {
  splashImageSrc: string
  name: string
}) => {
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
          'url(https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/091bf9a6-2eb1-45cc-6350-7248e470e500/framesquare)',
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
          position: 'absolute',
          bottom: -80,
          display: 'flex',
        }}
      >
        <img
          src={splashImageSrc}
          style={{
            width: getScaled(420),
            height: getScaled(420),
          }}
        />
      </div>
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
          Bridge to the Superchain:
        </div>
        <div
          style={{
            display: 'flex',
            fontWeight: 600,
            fontSize: getScaled(68),
            lineHeight: `${getScaled(68)}px`,
          }}
        >
          {name}
        </div>
      </div>
    </div>
  )
}
