import { useEffect, useRef } from 'react';

const pdfPath = '/pdf-test-page/pdf_single.pdf/@@download/file';
const pdfjsLoadScript = ` import * as pdfjsDist from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/+esm';
window.pdfjsDist = pdfjsDist
`;

export function PDFViewer() {
  const pdfjsLib = useRef();
  const canvas = useRef();

  useEffect(() => {
    async function loadPdf() {
      window.pdfjsDist.GlobalWorkerOptions.workerSrc =
        // 'https://mozilla.github.io/pdf.js/build/pdf.worker.mjs';
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.worker.mjs';
      pdfjsLib.current = window.pdfjsDist; // Drag the library back into React land
      const pdfjs = pdfjsLib.current;
      const doc = await pdfjs.getDocument(pdfPath).promise;
      const firstPage = await doc.getPage(1);
      const viewport = firstPage.getViewport({ scale: 1 });
      canvas.current.height = viewport.height;
      canvas.current.width = viewport.width;
      firstPage.render({
        canvasContext: canvas.current.getContext('2d'),
        viewport: viewport,
      });
    }
    loadPdf();
  }, []);

  return (
    <>
      <p>PDF Viewer</p>
      <canvas ref={canvas} id="pdfjs-viewer" />
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: pdfjsLoadScript,
        }}
      ></script>
    </>
  );
}
