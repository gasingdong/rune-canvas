/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@createjs/easeljs' {
  let x: any;
  export = x;
}

declare module '*.png' {
  const value: never;
  export default value;
}

declare module '*.ttf' {
  const value: never;
  export default value;
}

declare module '*.otf' {
  const value: never;
  export default value;
}
