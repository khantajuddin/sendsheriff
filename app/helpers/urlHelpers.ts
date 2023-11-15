export const isUrlShortened = async (urls: string[]) => {
    const knownShorteningServices = new Set([
        "bit.ly",
        "goo.gl",
        "t.co",
        "tinyurl.com",
        "ow.ly",
        "is.gd",
        "buff.ly",
        "bc.vc",
        "shorte.st",
        "adf.ly",
        "po.st",
        "t.ly",
        "cli.gs",
        "fur.ly",
        "v.gd",
        "s.coop",
        "mcaf.ee",
        "snipurl.com",
        "ity.im",
        "adcrun.ch",
        "prettylinks.com",
        "short.cm",
        "shorturl.at",
        "soo.gd",
        "viralurl.com",
        "vurl.com",
        "zzb.bz",
        "kutt.it",
        "shorturl.to",
        "shorturl.eu",
        "shorturl.link",
        "yourls.org",
        "x.co",
        "tiny.cc",
        "budurl.com",
        "qr.net",
        "zz.gd"]
    );

    return urls.some(url => {
        const urlHostname = new URL(url).hostname;
        return knownShorteningServices.has(urlHostname);
    })
};