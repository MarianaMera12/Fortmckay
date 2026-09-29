/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @react-pdf/renderer depends on pdfkit, which loads its standard-font
  // metrics (.afm / .cjs files under pdfkit/js/data and
  // pdfkit/js/standard-fonts) from disk by dynamically-built paths.
  // Vercel's file tracer can't follow those to know to include them in
  // the deployed function, so it 500s with "Cannot find module
  // '.../pdfkit/js/...'" even though this works locally. Both settings
  // below are needed: external so the package isn't webpack-bundled,
  // and outputFileTracingIncludes so its data files ship with the
  // function.
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer", "pdfkit"],
    outputFileTracingIncludes: {
      "/**": ["./node_modules/pdfkit/js/data/**", "./node_modules/pdfkit/js/standard-fonts/**"],
    },
  },
};
export default nextConfig;
