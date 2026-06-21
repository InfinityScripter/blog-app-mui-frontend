// ----------------------------------------------------------------------

export const loadFeaturesAsync = async () =>
  import("./features").then((res) => res.default);
