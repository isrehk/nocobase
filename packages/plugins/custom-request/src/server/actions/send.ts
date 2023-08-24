import { Context, Next } from '@nocobase/actions';
import actions from '@nocobase/actions';
import { parse } from '@nocobase/utils';

import axios from 'axios';

const arrayToObject = (arr: { name: string; value: string }[]) => {
  return arr.reduce((acc, cur) => {
    acc[cur.name] = cur.value;
    return acc;
  }, {});
};

const omitNullAndUndefined = (obj: any) => {
  return Object.keys(obj).reduce((acc, cur) => {
    if (obj[cur] !== null && typeof obj[cur] !== 'undefined') {
      acc[cur] = obj[cur];
    }
    return acc;
  }, {});
};

export async function send(ctx: Context, next: Next) {
  const { filterByTk, resourceName, values = {} } = ctx.action.params;
  const { currentRecord: currentRecordId, requestConfig: requestConfigFirst = {} } = values;

  const repo = ctx.db.getRepository(resourceName);
  const requestConfig = await repo.findOne({
    filter: {
      key: filterByTk,
    },
  });

  if (!requestConfig) {
    ctx.throw(500, 'request config not found');
  }

  ctx.withoutDataWrapping = true;

  const { collectionName, url, headers = {}, params = {}, data = {}, ...options } = requestConfig.options;
  let currentRecord = {};
  if (collectionName && typeof currentRecordId !== 'undefined') {
    currentRecord = ctx.db.getRepository(collectionName).findOne({
      filterByTk: currentRecordId,
    });
  }

  const variables = {
    currentRecord,
    currentUser: ctx.auth.user,
    currentTime: new Date().toISOString(),
  };

  try {
    ctx.body = await axios({
      ...options,
      url: parse(url)(variables),
      headers: {
        ...omitNullAndUndefined(parse(arrayToObject(headers))(variables)),
        Authorization: 'Bearer ' + ctx.getBearerToken(),
      },
      params: parse(arrayToObject(params))(variables),
      data: parse({
        ...data,
        ...requestConfig?.data,
      })(variables),
    }).then((res) => {
      return res.data;
    });
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      ctx.status = err.response?.status || 500;
      ctx.body = err.response?.data || { message: err.message };
    } else {
      ctx.throw(500, err?.message);
    }
  }

  return next();
}
