import { defHttp } from '/@/utils/http/axios';

/**
 * @description: Upload interface
 */
export function uploadApi(params: any, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return defHttp.post(
    {
      url: '/predict/ocr_system',
      onUploadProgress,
      params,
    },
    { apiUrl: 'http://47.116.71.73:8866' }
  );
}

export function uploadDogtag(params: any) {
  return defHttp.post({
    url: '/images',
    params,
  });
}
