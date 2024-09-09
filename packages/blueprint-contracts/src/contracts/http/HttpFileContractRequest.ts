export const HTTP_FILE_CONTRACT = Symbol("HTTP_FILE_CONTRACT");

export interface HttpFileContractRequest {
  $file: Blob;
}
