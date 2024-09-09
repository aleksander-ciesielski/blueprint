import { HttpService } from "~/services/HttpService";

export function useHttpService(): HttpService {
  return new HttpService();
}
