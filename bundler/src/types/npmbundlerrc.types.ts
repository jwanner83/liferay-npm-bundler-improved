interface npmbundlerrc {
  'create-jar'?: createJar
}

interface createJar {
  features?: features
  'output-dir'?: string
}

interface features {
  localization?: string
}

export default npmbundlerrc
