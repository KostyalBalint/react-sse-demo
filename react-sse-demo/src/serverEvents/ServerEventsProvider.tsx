import React, { createContext, PropsWithChildren, useMemo } from "react";

export interface ServerEventsContextValue extends EventSource {}

export const ServerEventsContext = createContext<ServerEventsContextValue>(
  {} as ServerEventsContextValue,
);

interface EventsProviderProps {
  url: string;
  withCredentials?: boolean;
}

export const ServerEventsProvider = (
  props: PropsWithChildren<EventsProviderProps>,
) => {
  const serverEvents = useMemo(
    () =>
      new EventSource(props.url, { withCredentials: props.withCredentials }),
    [props.url, props.withCredentials],
  );

  return (
    <ServerEventsContext.Provider value={serverEvents}>
      {props.children}
    </ServerEventsContext.Provider>
  );
};
