import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <title>Foodia</title>
      <Head />
      <body className="lg:bg-gray-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
