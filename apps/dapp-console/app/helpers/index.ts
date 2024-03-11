export const openWindow = (url: string, target?: string, specs?: string) => {
  const _target = target || '_blank'
  const _specs = specs || 'noopener noreferrer'
  window.open(url, _target, _specs)
}
