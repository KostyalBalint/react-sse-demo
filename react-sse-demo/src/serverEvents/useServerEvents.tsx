import { useContext, useState } from "react";
import { ServerEventsContext } from "./ServerEventsProvider";

type ServerEventBase = { type: string; [key: string]: unknown };

export type ProcessingResult<T extends ServerEventBase> = [T | undefined];

export const useServerEvents = <T extends ServerEventBase>(
  requiredEvent: T["type"],
): ProcessingResult<T> => {
  const [eventData, setEventData] = useState<T>();

  const eventSource = useContext(ServerEventsContext);

  if (!eventSource.url) {
    throw new Error(
      `To use "useServerEvents()" wrap your application in provider "ServerEventsProvider"`,
    );
  }

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type !== requiredEvent) return;
    setEventData(data);
  };

  return [eventData];
};
