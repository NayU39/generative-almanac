import { toPng } from 'html-to-image'

export async function exportNodeAsPng(node: HTMLElement, fileName: string) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#f7f2e8',
  })

  const link = document.createElement('a')
  link.download = fileName
  link.href = dataUrl
  link.click()
}
