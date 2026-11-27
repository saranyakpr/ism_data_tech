export default function sitemap() {
    const base = "https://ismdatatech.com";
    return [
        { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${base}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${base}/careers/apply`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ];
}
