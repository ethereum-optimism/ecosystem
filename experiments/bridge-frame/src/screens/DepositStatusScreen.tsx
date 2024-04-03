import { getScaled } from '@/util/getScaled'

export const DepositStatusScreen = ({
  primaryText,
  secondaryText,
}: {
  primaryText: string
  secondaryText?: string
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
            marginBottom: getScaled(28),
            fontSize: getScaled(28),
            lineHeight: `${getScaled(28)}px`,
          }}
        >
          {primaryText}
        </div>
        {secondaryText && (
          <div
            style={{
              display: 'flex',
              fontWeight: 500,
              fontSize: getScaled(28),
              lineHeight: `${getScaled(28)}px`,
              textTransform: 'uppercase',
            }}
          >
            {secondaryText}
          </div>
        )}
      </div>
    </div>
  )
}
