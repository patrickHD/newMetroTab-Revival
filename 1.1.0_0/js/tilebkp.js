var _chromeVer = window.navigator.userAgent.match(/chrome\/([\d.]+)/i);
var chromeVer = _chromeVer != null ? _chromeVer[1] : _chromeVer;
var orgNewtabUrl = (chromeVer != null &&  chromeVer > '33') ? "chrome-search://local-ntp/local-ntp.html" : "chrome-internal://newtab/";
var tilebkps = [];
tilebkps['en'] = [
    {
        "hashid": "tilegmail",
        "bloque": "social",
        "etiqueta": "Gmail",
        "link": "https://mail.google.com/mail/",
        "dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/gmail.svg",
        "bgcolor": "#c00000",
        "livetile": false
    },
    {
        "hashid": "tilefacebook",
        "bloque": "social",
        "etiqueta": "facebook",
        "link": "https://www.facebook.com/",
        "icono": "/iconos/facebook.svg",
        "bgcolor": "rgb(59, 89, 152)",
        "livetile": true
    },
    {
        "hashid": "tiletwitter",
        "bloque": "social",
        "etiqueta": "twitter",
        "link": "https://www.twitter.com/",
        "icono": "/iconos/twbird.svg",
        "bgcolor": "#00a0d1",
        "livetile": true
    },
    {
        "hashid": "tilegplus",
        "bloque": "social",
        "etiqueta": "Google+",
        "link": "https://plus.google.com/",
        "icono": "/iconos/plus.google.svg",
        "bgcolor": "#db4a39",
        "livetile": true
    },
    {
        "hashid": 'tiledevart',
        "bloque": 'social',
        "etiqueta": 'deviantArt',
        "link": 'http://www.deviantart.com/',
        "bgcolor": 'rgb(78, 98, 82)',
        "icono": '/iconos/deviantart.svg',
        "livetile": true
    },
    {
        "hashid": "tilecalendario",
        "bloque": "social",
        "etiqueta": getI18nMsg('h1tile_calendario'),
        "link": "https://www.google.com/calendar/",
        "dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/metro_cal.svg",
        "spfunc": {
            "preload": "calendario"
        },
        "livetile": true
    },
    {
        "hashid": "tileyoutube",
        "bloque": "social",
        "etiqueta": "YouTube",
        "link": "http://www.youtube.com/",
        "icono": "/iconos/youtube.svg",
        "bgcolor": "#c4302b"
    },
    {
        "hashid": "tilecnn",
        "bloque": "social",
        "etiqueta": "cnn",
        "link": "http://www.cnn.com",
        "icono": "/iconos/cnn.svg",
        "bgcolor": "#CC0000"
    },
	{
        "hashid": "tiletedtalks",
        "bloque": "social",
        "etiqueta": "TED talks",
        "link": "/appted/index.html",
        "dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/ted.svg",
        "bgcolor": "#ffffff",
        "livetile": true,
        "rssurl": "http://feeds.feedburner.com/tedtalks_video"
    },
    {
        "hashid": "tilegoogle",
        "bloque": "social",
        "etiqueta": "Google",
        "link": "/appgoogle/index.html",
		"dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/google.svg",
        "bgcolor": "rgb(0, 169, 79)"
    },
    {
        "hashid": "tilenetflix",
        "bloque": "social",
        "etiqueta": "netflix",
        "link": "http://www.netflix.com/",
        "icono": "/iconos/netflix.svg",
        "bgcolor": "rgb(166, 8, 9)"
    },
    {
        "hashid": "tiletumblr",
        "bloque": "social",
        "etiqueta": "tumblr.",
        "link": "http://www.tumblr.com/dashboard",
        "icono": "/iconos/tumblr.svg",
        "bgcolor": "#2c4762",
    },
    {
        "hashid": "tileclima",
        "bloque": "social",
        "etiqueta": getI18nMsg('h1tile_clima'),
        "link": "/appclima/index.html",
        "dimens": [
            "4",
            "4"
        ],
        "icono": "/iconos/metro_clima.svg",
        "bgcolor": "rgb(3, 58, 113)",
        "livetile": true
    },
    {
        "hashid": "tileamazon",
        "bloque": "social",
        "etiqueta": "amazon",
        "link": "http://www.amazon.com",
        "dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/amazon.svg",
        "bgcolor": "rgb(255, 153, 0)"
    },
    {
        "hashid": "tilewalmart",
        "bloque": "social",
        "etiqueta": "Walmart",
        "link": "http://www.walmart.com/",
        "dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/walmart.svg",
        "bgcolor": "#0080ff"
    },
    {
        "hashid": "tilelinkedin",
        "bloque": "social",
        "etiqueta": "LinkedIn",
        "link": "http://www.linkedin.com/",
        "icono": "/iconos/linkedin.svg",
        "bgcolor": "#0077B5",
        "livetile": true
    },
    {
        "hashid": "tilealiexpress",
        "bloque": "group_1",
        "etiqueta": "Aliexpress",
        "link": "http://www.aliexpress.com/",
        "dimens": [
            "4",
            "4"
        ],
        "icono": "/iconos/aliexpress.svg",
        "bgcolor": "rgb(230, 46, 4)"
    },
    {
        "hashid": "tileskydrive",
        "bloque": "group_1",
        "etiqueta": "SkyDrive",
        "link": "https://skydrive.live.com/",
        "icono": "/iconos/skydrive.svg",
        "bgcolor": "#094ab2"
    },
    {
        "hashid": "tileevernote",
        "bloque": "group_1",
        "etiqueta": "Evernote",
        "link": "http://www.evernote.com/",
        "icono": "/iconos/evernote.svg",
        "bgcolor": "rgb(82, 181, 41)"
    },
    {
        "hashid": "tilelastfm",
        "bloque": "group_1",
        "etiqueta": "last.fm",
        "link": "http://www.last.fm/",
        "icono": "/iconos/lastfm.svg",
        "bgcolor": "#d51007"
    },
    {
        "hashid": "tilegrooveshark",
        "bloque": "group_1",
        "etiqueta": "Grooveshark",
        "link": "http://www.grooveshark.com/",
        "icono": "/iconos/grooveshark.svg",
        "bgcolor": "#f77f00"
    },
    {
        "hashid": "tileyahoo",
        "bloque": "group_1",
        "etiqueta": "Yahoo",
        "link": "http://www.yahoo.com",
        "dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/yahoo.svg",
        "bgcolor": "#400090"
    },
    {
        "hashid": "tilerss",
        "bloque": "group_1",
        "etiqueta": getI18nMsg('h1tile_rssfeed'),
        "link": "https://reader.digg.com",
        "dimens": [
            "2",
            "2"
        ],
        "icono": "/iconos/rss.svg",
        "bgcolor": "#e15a00",
        "livetile": true
    },
    {
        "hashid": "tilevimeo",
        "bloque": "group_1",
        "etiqueta": "vimeo",
        "link": "http://www.vimeo.com",
        "icono": "/iconos/vimeo.svg",
        "bgcolor": "#354657"
    },
    {
        "hashid": "tilemacys",
        "bloque": "group_1",
        "etiqueta": "Macys",
        "link": "http://www.macys.com/",
        "icono": "/iconos/macys.svg",
        "bgcolor": "#333333"
    },
    {
        "hashid": "tilebestbuy",
        "bloque": "group_1",
        "etiqueta": "Bestbuy",
        "link": "http://www.bestbuy.com/",
        "icono": "/iconos/bestbuy.svg",
        "bgcolor": "#efbd10"
    },
    {
        "hashid": "tileam5",
        "bloque": "group_1",
        "etiqueta": "am5",
        "link": "http://www.am5.com",
        "icono": "/iconos/am5.svg",
        "bgcolor": "#cc0000",
        "dimens": [
            "4",
            "2"
        ]
    },
    {
        "hashid": "tilepinterest",
        "bloque": "group_1",
        "etiqueta": "pinterest",
        "link": "http://www.pinterest.com",
        "icono": "/iconos/pinterest.svg",
        "bgcolor": "#cc0000"
    },
    {
        "hashid": "tilewikipedia",
        "bloque": "group_1",
        "etiqueta": "wikipedia",
        "link": "http://www.wikipedia.com",
        "icono": "/iconos/wikipedia.svg",
        "bgcolor": "#808080"
    },
    {
        "hashid": "tile8vs",
        "bloque": "group_1",
        "etiqueta": "8VS",
        "link": "http://www.8vs.com/?r=metro",
        "dimens": [
            "4",
            "4"
        ],
        "icono": "/iconos/8vs.svg",
        "bgcolor": "#0f80c2",
        "livetile": true
    },
    {
        "hashid": "tilejcpenney",
        "bloque": "group_1",
        "etiqueta": "JCP",
        "link": "http://www.jcpenney.com/",
        "icono": "/iconos/jcpenney.svg",
        "bgcolor": "#ad1212"
    },
    {
        "hashid": "tileebay",
        "bloque": "group_1",
        "etiqueta": "ebay",
        "link": "http://www.ebay.com/",
        "icono": "/iconos/ebay.svg",
        "bgcolor": "rgb(153, 204, 0)"
    },
    {
        "hashid": "tileflickr",
        "bloque": "group_1",
        "etiqueta": "flickr",
        "link": "/appflickr/index.html",
        "dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/flickrdots.svg",
        "bgcolor": "#bbb",
        "livetile": true
    },
    {
        "hashid": "tiledpx",
        "bloque": "group_2",
        "etiqueta": "500px",
        "link": "http://500px.com",
        "dimens": [
            "4",
            "4"
        ],
        "icono": "/iconos/500px.svg",
        "bgcolor": "#545454",
        "livetile": true
    },
    {
        "hashid": "tileoutlook",
        "bloque": "group_2",
        "etiqueta": "Outlook",
        "link": "https://www.outlook.com/",
        "icono": "/iconos/outlook.svg",
        "bgcolor": "#0072c6",
        "livetile": true
    },
    {
        "hashid": "tileyahoomail",
        "bloque": "group_2",
        "etiqueta": "Yahoo Mail",
        "link": "https://mail.yahoo.com",
        "icono": "/iconos/yahoomail.svg",
        "bgcolor": "#61399D",
        "livetile": true
    },
    {
        "hashid": "tilereloj",
        "bloque": "group_2",
        "etiqueta": getI18nMsg('h1tile_reloj'),
        "link": "http://time.is/",
        "dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/metro_reloj.svg",
        "bgcolor": "#ab052f",
        "spfunc": {
            "preload": "hora"
        }
    },
    {
        "hashid": "chromestore",
        "bloque": "group_2",
        "etiqueta": "Chrome Web Store",
        "link": "https://chrome.google.com/webstore",
        "dimens": [
            "4",
            "2"
        ],
        "icono": "/iconos/chromestore.png",
        "bgcolor": "#A20025"
    },
    {
        "hashid": "tileoriginalntp",
        "bloque": "group_2",
        "etiqueta": getI18nMsg('h1tile_originalntp'),
        "link": orgNewtabUrl,
        "icono": "/iconos/origntp.svg",
        "bgcolor": "#eeeeee"
    }
];

var ui_locale = chrome.i18n.getMessage("@@ui_locale");
tilebkp = tilebkps[ui_locale] ? tilebkps[ui_locale] : tilebkps['en'];