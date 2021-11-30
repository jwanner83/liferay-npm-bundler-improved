interface npmbundlerrc {
  'create-jar'?: createJar
}

interface createJar {
  features?: features
}

interface features {
  localization?: string
}

export default npmbundlerrc
