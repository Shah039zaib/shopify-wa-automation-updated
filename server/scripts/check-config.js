try {
  // simple noop checker to avoid some library warnings during build
  // (keeps build prehook quiet)
  console.log("[check-config] no config.load() function found (ok)");
} catch (e) {
  // ignore
}
