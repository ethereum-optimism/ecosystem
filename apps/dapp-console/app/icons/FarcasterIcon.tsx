import { IconProps } from '@/app/icons/types'

const FarcasterIcon = ({
  height = 24,
  width = 24,
  size,
  color = 'currentColor',
}: IconProps) => {
  const _height = size || height
  const _width = size || width

  return (
    <svg
      fill={color}
      height={_height}
      width={_width}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M5.43195 3H18.3314V21.3432H16.4379V12.9408H16.4193C16.21 10.6186 14.2584 8.79882 11.8817 8.79882C9.50495 8.79882 7.55328 10.6186 7.34402 12.9408H7.32544V21.3432H5.43195V3Z" />
      <path d="M2 5.60355L2.76923 8.2071H3.42012V18.7396C3.09332 18.7396 2.8284 19.0046 2.8284 19.3314V20.0414H2.71006C2.38326 20.0414 2.11834 20.3063 2.11834 20.6331V21.3432H8.74556V20.6331C8.74556 20.3063 8.48064 20.0414 8.15385 20.0414H8.0355V19.3314C8.0355 19.0046 7.77058 18.7396 7.44379 18.7396H6.73373V5.60355H2Z" />
      <path d="M16.5562 18.7396C16.2294 18.7396 15.9645 19.0046 15.9645 19.3314V20.0414H15.8462C15.5194 20.0414 15.2544 20.3063 15.2544 20.6331V21.3432H21.8817V20.6331C21.8817 20.3063 21.6167 20.0414 21.2899 20.0414H21.1716V19.3314C21.1716 19.0046 20.9067 18.7396 20.5799 18.7396V8.2071H21.2308L22 5.60355H17.2663V18.7396H16.5562Z" />
    </svg>
  )
}

export { FarcasterIcon }