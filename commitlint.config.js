module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "scope-enum": [
      2,
      "always",
      ["shared", "inversify", "inversiland", "metadata", "common", "core"],
    ],
  },
};
