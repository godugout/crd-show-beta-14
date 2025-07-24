declare module 'gif.js' {
  interface GifOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    background?: string;
    transparent?: string;
    dither?: boolean;
    globalPalette?: boolean;
    repeat?: number;
    debug?: boolean;
  }

  interface GifFrame {
    delay?: number;
    copy?: boolean;
  }

  class GIF {
    constructor(options?: GifOptions);
    addFrame(
      element: HTMLCanvasElement | CanvasRenderingContext2D | ImageData,
      options?: GifFrame
    ): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: 'progress', callback: (progress: number) => void): void;
    on(event: 'abort', callback: () => void): void;
    render(): void;
    abort(): void;
  }

  export = GIF;
}