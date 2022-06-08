export function getOffsetAndLimitFormReq(
   totalProducts: number,
   limit: string,
   offset: string,
   maxLimit: number = 4
) {
   const parceIntLimit = parseInt(limit);
   const parceIntOffset = parseInt(offset);

   return {
      finalLimit: parceIntLimit > maxLimit ? maxLimit : parceIntLimit,
      finalOffset: parceIntOffset >= totalProducts ? 0 : parceIntOffset,
   };
}
