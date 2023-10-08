import { lastValueFrom, map, take, type Observable } from "rxjs";
import { isErrorPayload, type Payload } from "_payloads";
export function mapToPromise<T extends Payload | void, R>( stream: Observable<T>, project: (value: T) => R, ) {
  return lastValueFrom(
    stream.pipe(
      take<T>(1),
      map<T, R>((response) => {
        if (response && isErrorPayload(response)) {
          throw new Error(response.message);
        }
        return project(response);
      }),
    ),
  );
}
