import { ref } from 'vue'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

// True for about a second after paging forward into the slide. Load, export, going back and in-slide clicks never set it.
export function useEntrance() {
  const entering = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  onSlideEnter((to, from) => {
    clearTimeout(timer)
    entering.value = false
    if (from === undefined || to <= from)
      return
    // Wait a frame so the slide is visible before the class lands, or the animation starts on a hidden element.
    requestAnimationFrame(() => {
      entering.value = true
      timer = setTimeout(() => { entering.value = false }, 1000)
    })
  })

  onSlideLeave(() => {
    clearTimeout(timer)
    entering.value = false
  })

  return entering
}
