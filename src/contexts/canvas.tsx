import { createContext, useState } from 'react';

import * as CanvasFunctions from '@/functions/canvas2d';

type Context = {
  drawPixel: (x: number, y: number) => Promise<void>;
  desenharReta: (
    x: number,
    y: number,
    x2: number,
    y2: number,
    type: string
  ) => Promise<number[][]>;
  desenharCubo: (
    x: number,
    y: number,
    size: number
  ) => Promise<{
    vertices: number[][];
    lados: number[][];
  }>;
  desenharRetangulo: (
    x: number,
    y: number,
    size: number
  ) => Promise<{
    vertices: number[][];
    lados: number[][];
  }>;
  desenharCirculo: (r: number) => Promise<number[][]>;
  clearCanvas: () => Promise<void>;
  inp_to_ndc: ([x, y]: [x: number, y: number]) => number[];
  user_to_ndc: (x: number, y: number) => number[];
  ndc_to_dc: (x: number, y: number) => number[];
};

export const CanvasGlobalContext = createContext<Context | null>(null);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [grid, setGrid] = useState(false);

  // Contexto Canvas2D
  function getCanvas() {
    return new Promise<CanvasRenderingContext2D>((resolve, reject) => {
      const canvas = document.getElementById(
        'canvas'
      ) as HTMLCanvasElement | null;
      if (canvas !== null) {
        const context = canvas.getContext('2d');
        if (context !== null) {
          resolve(context);
        } else {
          reject('Ops! Erro ao obter o contexto 2D do canvas.');
        }
      } else {
        reject('Ops! Erro interno no display.');
      }
    });
  }

  // Pixel
  function drawPixel(x: number, y: number) {
    return new Promise<void>((resolve, reject) => {
      getCanvas()
        .then((ctx) => resolve(CanvasFunctions.setPixel(ctx, x, y)))
        .catch((e) => reject(e));
    });
  }

  // Reta
  function desenharReta(
    x: number,
    y: number,
    x2: number,
    y2: number,
    type: string
  ) {
    setGrid(true);
    return new Promise<number[][]>((resolve, reject) => {
      getCanvas()
        .then((ctx) => {
          !grid && CanvasFunctions.setLines(ctx);
          resolve(
            type === 'DDA'
              ? CanvasFunctions.desenharRetaDDA(ctx, x, y, x2, y2)
              : CanvasFunctions.desenharRetaPM(ctx, x, y, x2, y2)
          );
        })
        .catch((e) => reject(e));
    });
  }

  // Circulo
  function desenharCirculo(raio: number) {
    setGrid(true);
    return new Promise<number[][]>((resolve, reject) => {
      getCanvas()
        .then((ctx) => {
          !grid && CanvasFunctions.setLines(ctx);
          resolve(CanvasFunctions.desenharPontoMedioCirculo(ctx, raio));
        })
        .catch((e) => reject(e));
    });
  }

  // Cubo 2D
  function desenharCubo(x: number, y: number, size: number) {
    setGrid(true);
    return new Promise<{
      vertices: number[][];
      lados: number[][];
    }>((resolve, reject) => {
      getCanvas()
        .then((ctx) => {
          !grid && CanvasFunctions.setLines(ctx);
          resolve(CanvasFunctions.desenharCubo(ctx, x, y, size));
        })
        .catch((e) => reject(e));
    });
  }

  function desenharRetangulo(x: number, y: number, size: number) {
    setGrid(true);
    return new Promise<{
      vertices: number[][];
      lados: number[][];
    }>((resolve, reject) => {
      getCanvas()
        .then((ctx) => {
          !grid && CanvasFunctions.setLines(ctx);
          resolve(CanvasFunctions.desenharRetangulo(ctx, x, y, size));
        })
        .catch((e) => reject(e));
    });
  }

  // Limpar tela
  function clearCanvas() {
    return new Promise<void>((resolve, reject) => {
      getCanvas()
        .then((ctx) => {
          setGrid(false);
          resolve(CanvasFunctions.clear(ctx));
        })
        .catch((e) => reject(e));
    });
  }

  // Transformações
  function inp_to_ndc([x, y]: [x: number, y: number]) {
    return CanvasFunctions.inp_to_ndc([x, y]);
  }

  function user_to_ndc(x: number, y: number) {
    return CanvasFunctions.user_to_ndc(x, y);
  }

  function ndc_to_dc(x: number, y: number) {
    return CanvasFunctions.ndc_to_dc(x, y);
  }

  return (
    <CanvasGlobalContext.Provider
      value={{
        drawPixel,
        desenharReta,
        desenharCubo,
        clearCanvas,
        desenharCirculo,
        inp_to_ndc,
        user_to_ndc,
        ndc_to_dc,
        desenharRetangulo
      }}
    >
      {children}
    </CanvasGlobalContext.Provider>
  );
};

export default CanvasProvider;
