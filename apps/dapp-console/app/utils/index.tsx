export const getFormattedCountdown = (time: number) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = time % 60
  return `${hours}h ${minutes}m ${seconds}s`
}
