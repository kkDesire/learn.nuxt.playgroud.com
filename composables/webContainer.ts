import { WebContainer } from '@webcontainer/api'

// Call only once
let _webcontainerInstance: Promise<WebContainer>
export async function useWebContainer() {
  if (!_webcontainerInstance)
    _webcontainerInstance = WebContainer.boot()
  return await _webcontainerInstance
}
