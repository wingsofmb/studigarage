import { HttpHeaders, HttpParams } from '@angular/common/http';

export type Headers = HttpHeaders | { [header: string]: string | string[] };
export type QueryParams = HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
