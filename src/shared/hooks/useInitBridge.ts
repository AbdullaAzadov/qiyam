import  { useEffect } from 'react'
import { clearWebviewListeners } from '../lib/bridge'

export const useInitBridge = () => {
  useEffect(() => {
    
    return () => {
      clearWebviewListeners()
    }
  }, [])
}
