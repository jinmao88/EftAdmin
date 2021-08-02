import { defHttp } from '/@/utils/http/axios';

export function curd(params) {
  return defHttp.post({ url: '/api/curd', params });
}
