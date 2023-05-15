interface npmbundlerrc {
  'create-jar'?: createJar
}

interface createJar {
  features?: features
  'output-dir'?: string
}

interface features {
  localization?: string
  configuration?: string
}

export default npmbundlerrc
