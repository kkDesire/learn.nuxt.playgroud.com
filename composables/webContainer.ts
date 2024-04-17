import { WebContainer } from '@webcontainer/api'

// Call only once
let _webcontainerInstance: WebContainer
export async function useWebContainer() {
  if (!_webcontainerInstance) {
    _webcontainerInstance = await WebContainer.boot()
    return _webcontainerInstance
  }
  return _webcontainerInstance
}
