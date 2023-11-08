import { useEffect, useState } from "react";

type UseEventFetchProps<T extends object> = {
  initialUrl: string;
  diffUrl: string;
  fetchInterval?: number;
  mapIdField: keyof T;
};

export const useEventFetch = <T extends object>(
  props: UseEventFetchProps<T>,
) => {
  const [data, setData] = useState<Map<string, T>>(new Map());

  const updateMap = (data: T[]) => {
    setData((prev) => {
      const map = new Map<string, T>(prev);
      data.forEach((value) => {
        map.set(String(value[props.mapIdField]), value);
      });
      return map;
    });
  };

  useEffect(() => {
    //Fetch the init
    fetch(props.initialUrl)
      .then((response) => response.json())
      .then((data) => updateMap(data));

    //Fetch the diff
    setInterval(() => {
      fetch(props.diffUrl)
        .then((response) => response.json())
        .then((data) => updateMap(data));
    }, props.fetchInterval || 1000);
  }, [props.initialUrl]);

  return data;
};
