/**
 * A markdown-it plugin to support custom header metadata
 * Headers that end with * are Options API only
 * Headers that end with ** are Composition API only
 * This plugin strips the markers and augments the extracted header data,
 * which can be then used by the theme to filter headers.
 *
 * we will likely also need special syntax '{#xxx}' for preserving the same anchor
 * links across translations similar to the one at
 * https://github.com/vitejs/docs-cn/tree/main/.vitepress/markdown-it-custom-anchor
 */

 const anchorMatch = /^.+(\s*\{#([a-z0-9\-_]+?)\}\s*)$/;

 const removeAnchorFromTitle = (oldTitle) => {
   const match = anchorMatch.exec(oldTitle);
   return match ? oldTitle.replace(match[1], '').trim() : oldTitle;
 }

exports.headerPlugin = (md) => {
  const oldTitle = md.renderer.rules.text;
  md.renderer.rules.text = (tokens, idx, options, env, slf) => {
    const titleAndId = oldTitle(tokens, idx, options, env, slf);
    return removeAnchorFromTitle(titleAndId);
  };

  const originalOpen = md.renderer.rules.heading_open
  md.renderer.rules.heading_open = (tokens, i, ...rest) => {
    for (const child of tokens[i + 1].children) {
      if (child.type === 'text' && child.content.endsWith('*')) {
        child.content = child.content.replace(/\s*\*+$/, '')
      }
    }
    return originalOpen.call(null, tokens, i, ...rest)
  }

  md.renderer.rules.heading_close = (tokens, i, options, env, self) => {
    const headers = md.__data?.headers
    if (headers) {
      headers.forEach(element => {
        element.title = removeAnchorFromTitle(element.title);
      });

      const last = headers[headers.length - 1]
      if (last.title.endsWith('*')) {
        if (last.title.endsWith('**')) {
          last.compositionOnly = true
        } else {
          last.optionsOnly = true
        }
        last.title = last.title.replace(/\s*\*+$/, '')
      }
    }
    return self.renderToken(tokens, i, options)
  }
}
