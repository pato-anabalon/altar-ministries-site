import type { MDXComponents } from "mdx/types";

/**
 * Global MDX elements (event bodies and other long-form content), mapped to the type scale.
 * Required by @next/mdx in the App Router.
 */
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 type-h2 first:mt-0" {...props} />,
  h3: (props) => <h3 className="mt-8 type-h3" {...props} />,
  p: (props) => <p className="mt-5 type-body measure first:mt-0" {...props} />,
  ul: (props) => <ul className="mt-5 grid list-disc gap-2 pl-5 type-body measure marker:text-muted" {...props} />,
  ol: (props) => <ol className="mt-5 grid list-decimal gap-2 pl-5 type-body measure marker:text-muted" {...props} />,
  a: (props) => <a className="underline decoration-1 underline-offset-[0.22em] hover:text-muted" {...props} />,
  blockquote: (props) => <blockquote className="mt-8 border-l border-rule pl-6 type-lead" {...props} />,
  strong: (props) => <strong className="font-medium" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
