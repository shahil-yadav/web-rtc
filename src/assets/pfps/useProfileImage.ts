import images from './data'

export function useProfileImage() {
  const randInt = Math.random()
  const chooseImage = randInt * images.length
  const imgIndex = chooseImage - 1
  return images.at(imgIndex)
}
