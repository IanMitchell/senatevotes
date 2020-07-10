import React from 'react';
import Head from 'next/head';

export default function Social({ title, description }) {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} key="og-title" />
      <meta
        property="og:description"
        content={description}
        key="og-desciption"
      />
      <meta name="description" content={description} key="description" />
    </Head>
  );
}
