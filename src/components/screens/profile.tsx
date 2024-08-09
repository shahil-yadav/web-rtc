import { useState } from 'react'
import images from '~/assets/pfps/data'

interface ImageType {
  alt: string
  index: number
  src: string
}

function Profile() {
  const [state, setState] = useState<ImageType[]>([])

  function handleError(src: string, alt: string, index: number) {
    setState((prev) => [...prev, { src, alt, index }])
  }

  return (
    <div className="flex flex-wrap gap-3 bg-black text-white">
      {images.map((value, index) => (
        <img
          key={index}
          onError={() => handleError(value.src, value.alt, index)}
          className="aspect-square w-28"
          src={value.src}
          alt={value.alt}
        />
      ))}
    </div>
  )
}

export default Profile
