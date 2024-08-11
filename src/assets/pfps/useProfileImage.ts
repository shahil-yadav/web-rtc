import images from './data'

let avatar: { src: string; alt: string } | undefined

export function useProfileImage() {
  if (avatar === undefined) {
    const randInt = Math.random()
    const chooseImage = Math.round(randInt * images.length)
    const imgIndex = chooseImage - 1
    avatar = images.at(imgIndex)
  }

  return avatar
}
