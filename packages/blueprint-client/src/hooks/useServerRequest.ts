import * as React from "react";
import type { HttpContract } from "@blueprint/contracts";
import type { AbortableRequest } from "~/services/HttpService";
import { useHttpService } from "~/hooks/useHttpService";

export function useServerRequest<TContract extends HttpContract<any, any>>(
  contract: TContract,
): AbortableRequest<TContract> {
  const httpService = useHttpService();

  const [request, setRequest] = React.useState<AbortableRequest<TContract>>(
    () => httpService.request({ contract }),
  );

  React.useEffect(() => {
    setRequest(httpService.request({ contract }));
  }, [contract]);

  return request;
}
