import { useEffect, useLayoutEffect } from 'react'

const useAvailableEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export default useAvailableEffect
