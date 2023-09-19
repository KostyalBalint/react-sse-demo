import { useContext, useEffect, useState } from "react";
import { ServerEventsContext } from "./ServerEventsProvider";

export interface ProcessingResult<T> {
  data: T | undefined;
}

export const useServerEvents = <T extends object>(): ProcessingResult<T> => {
  const [eventData, setEventData] = useState<T>();

  const eventSource = useContext(ServerEventsContext);

  if (!eventSource) {
    throw new Error(
      `To use "useServerEvents()" wrap your application in provider "ServerEventsProvider"`,
    );
  }

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setEventData(data);
  };

  return {
    data: eventData,
  };
};
