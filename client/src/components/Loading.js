import React, { memo } from "react";

import SyncLoader from "react-spinners/SyncLoader";
const Loading = () => {
  return (
    <SyncLoader
      color="rgba(123, 107, 101, 1)"
      loading
      margin={5}
      size={18}
      speedMultiplier={1}
    />
  );
};

export default memo(Loading);
