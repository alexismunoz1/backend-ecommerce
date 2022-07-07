export function getOffsetAndLimitFormReq(limit: number, maxLimit: number = 15) {
   return {
      finalLimit: limit > maxLimit ? maxLimit : limit,
   };
}
