enum envRegexes {
  PRODUCTION = "/publisher.justice-counts.org/i",
  STAGING = "/publisher-staging.justice-counts.org/i",
}

export const getEnv = () => {
  if (new RegExp(envRegexes.PRODUCTION).test(window.location.host)) {
    return "production";
  }
  if (new RegExp(envRegexes.STAGING).test(window.location.host)) {
    return "staging";
  }
  return "development";
};
