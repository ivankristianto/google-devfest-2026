import { defineShikiSetup } from '@slidev/types'

// vitesse-light comments are about 2:1 on the off-white code background; github-light keeps them readable.
export default defineShikiSetup(() => ({
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
}))
