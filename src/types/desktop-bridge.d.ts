export {}

declare global {
  interface Window {
    magokDesktop?: {
      openDevTools: () => Promise<boolean>
    }
  }
}
