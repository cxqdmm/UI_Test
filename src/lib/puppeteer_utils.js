async function createPageForTarget(browser, targetId) {
    const target = await browser._targets.get(targetId);
    assert(await target._initializedPromise, 'Failed to create target for page');
    const page = await target.page();
    return page;
  }
  module.exports = {createPageForTarget}