import {
  cleanAttributes,
  cleanHeaders,
  cleanHOnes,
  cleanImages,
  cleanTags,
  removeEmpty,
  rewriteTopLevel,
  stripJunkTags,
  makeLinksAbsolute,
} from 'utils/dom';

// Clean our article content, returning a new, cleaned node.
export default function extractCleanNode(
  article,
  {
    $,
    cleanConditionally = true,
    title = '',
    url = '',
    defaultCleaner = true,
  }
) {
  // Rewrite the tag name to div if it's a top level node like body or
  // html to avoid later complications with multiple body tags.
  rewriteTopLevel(article, $);

  // Drop small images and spacer images
  // Only do this is defaultCleaner is set to true;
  // this can sometimes be too aggressive.
  if (defaultCleaner) cleanImages(article, $);

  // Drop certain tags like <title>, etc
  // This is -mostly- for cleanliness, not security.
  stripJunkTags(article, $);

  // H1 tags are typically the article title, which should be extracted
  // by the title extractor instead. If there's less than 3 of them (<3),
  // strip them. Otherwise, turn 'em into H2s.
  cleanHOnes(article, $);

  // Clean headers
  cleanHeaders(article, $, title);

  // Make links absolute
  makeLinksAbsolute(article, $, url);

  // Remove unnecessary attributes
  cleanAttributes(article);

  // We used to clean UL's and OL's here, but it was leading to
  // too many in-article lists being removed. Consider a better
  // way to detect menus particularly and remove them.
  // Also optionally running, since it can be overly aggressive.
  if (defaultCleaner) cleanTags(article, $, cleanConditionally);

  // Remove empty paragraph nodes
  removeEmpty(article, $);

  return article;
}
