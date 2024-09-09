declare module "babel-loader*" {
  const value: string;
  export default value;
}

declare module "worker-plugin/loader*" {
  const value: string;
  export default value;
}

declare module "ts-loader!*" {
  const value: string;
  export default value;
}

declare module "!!raw-loader!*" {
  const value: string;
  export default value;
}

declare module "!!html-loader!*" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  declare const src: string;
  declare const height: number;
  declare const width: number;
  declare const blurWidth: number;
  declare const blurHeight: number;
}
