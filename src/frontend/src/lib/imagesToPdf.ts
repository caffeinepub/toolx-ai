/**
 * Minimal browser-based PDF generator for images.
 * No external libraries required.
 */

function strToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

async function dataUrlToJpeg(
  dataUrl: string,
): Promise<{ bytes: Uint8Array; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas toBlob failed"));
          blob.arrayBuffer().then((buf) => {
            resolve({
              bytes: new Uint8Array(buf),
              width: img.width,
              height: img.height,
            });
          });
        },
        "image/jpeg",
        0.92,
      );
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = dataUrl;
  });
}

/** A4 at 72dpi in points */
const PAGE_W = 595;
const PAGE_H = 842;

export async function imagesToPdf(
  dataUrls: string[],
  onProgress?: (pct: number) => void,
): Promise<Blob> {
  const images = await Promise.all(
    dataUrls.map(async (url, i) => {
      const result = await dataUrlToJpeg(url);
      onProgress?.(Math.round(((i + 1) / dataUrls.length) * 60));
      return result;
    }),
  );

  const chunks: Uint8Array[] = [];
  let bytePos = 0;

  const write = (data: string | Uint8Array) => {
    const bytes = typeof data === "string" ? strToBytes(data) : data;
    chunks.push(bytes);
    bytePos += bytes.length;
  };

  const currentPos = () => bytePos;

  write("%PDF-1.4\n");
  write("%\xFF\xFF\xFF\xFF\n");

  const objOffsets: number[] = [];
  let objCount = 0;

  const beginObj = (n: number) => {
    objOffsets[n] = currentPos();
    write(`${n} 0 obj\n`);
  };
  const endObj = () => write("endobj\n");

  const catalogObjNum = ++objCount;
  const pagesObjNum = ++objCount;

  const pageObjs: number[] = [];
  const contentObjs: number[] = [];
  const xobjObjs: number[] = [];

  for (let i = 0; i < images.length; i++) {
    pageObjs.push(++objCount);
    contentObjs.push(++objCount);
    xobjObjs.push(++objCount);
  }

  beginObj(catalogObjNum);
  write(`<< /Type /Catalog /Pages ${pagesObjNum} 0 R >>\n`);
  endObj();

  beginObj(pagesObjNum);
  write(
    `<< /Type /Pages /Kids [${pageObjs.map((n) => `${n} 0 R`).join(" ")}] /Count ${images.length} >>\n`,
  );
  endObj();

  for (let i = 0; i < images.length; i++) {
    const { bytes: imgBytes, width: imgW, height: imgH } = images[i];

    const scale = Math.min(PAGE_W / imgW, PAGE_H / imgH);
    const w = Math.round(imgW * scale);
    const h = Math.round(imgH * scale);
    const x = Math.round((PAGE_W - w) / 2);
    const y = Math.round((PAGE_H - h) / 2);

    const imgName = `Im${i}`;
    const contentStr = `q ${w} 0 0 ${h} ${x} ${y} cm /${imgName} Do Q\n`;
    const contentBytes = strToBytes(contentStr);

    beginObj(pageObjs[i]);
    write(
      `<< /Type /Page /Parent ${pagesObjNum} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentObjs[i]} 0 R /Resources << /XObject << /${imgName} ${xobjObjs[i]} 0 R >> >> >>\n`,
    );
    endObj();

    beginObj(contentObjs[i]);
    write(`<< /Length ${contentBytes.length} >>\n`);
    write("stream\n");
    write(contentBytes);
    write("\nendstream\n");
    endObj();

    beginObj(xobjObjs[i]);
    write(
      `<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\n`,
    );
    write("stream\n");
    write(imgBytes);
    write("\nendstream\n");
    endObj();

    onProgress?.(60 + Math.round(((i + 1) / images.length) * 40));
  }

  const xrefPos = currentPos();
  const totalObjs = objCount + 1;
  write(`xref\n0 ${totalObjs}\n`);
  write("0000000000 65535 f \n");
  for (let i = 1; i <= objCount; i++) {
    const off = objOffsets[i];
    write(`${String(off).padStart(10, "0")} 00000 n \n`);
  }

  write(`trailer\n<< /Size ${totalObjs} /Root ${catalogObjNum} 0 R >>\n`);
  write(`startxref\n${xrefPos}\n%%EOF\n`);

  return new Blob(chunks as BlobPart[], { type: "application/pdf" });
}
