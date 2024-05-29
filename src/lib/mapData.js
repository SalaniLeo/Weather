let base = "https://imn-api.meteoplaza.com/v4/nowcast/tiles/";
let overlayItaly = "https://maptiler.infoplaza.io/api/maps/Border/static/11.69,41.27,5/1176x882.png?attribution=false";
let overlayEurope = "https://maptiler.infoplaza.io/api/maps/Border/static/8.24,49.41,4.2/1560x1560.png?attribution=false";
let minutes = [
    "15", "30", "45", "00",
];
let mese = new Date().getUTCMonth() + 1;
let giorno = new Date().getUTCDate();
let anno = new Date().getFullYear();
var offset = new Date().getTimezoneOffset() / 60;
var minuti = new Date().getMinutes()
export const hours = 4
export const stepNum = 4 * minutes.length

if (mese < 10) {
    // @ts-ignore
    mese = "0" + mese;
}

if (giorno < 10) {
    // @ts-ignore
    giorno = `0 ${giorno}`;
}

if (offset<0) {
    offset = 0+offset*-1
}

// @ts-ignore
function format(num) {
    return num < 10 ? "0" + num.toString() : num.toString();
}
// @ts-ignore
function getUrl(mapStyle, region, i, ora) {
  let time = format(ora) + "" + minutes[i]
    if(mapStyle == "radarsatellite-europe"){
      time = format(ora) + "" + minutes[i] + "00";
    }

    let zone = "";
    if (region == "italy") {
        zone = "/7/43/63/52/73";
    } else if (region == "europe") {
        zone = "/5/8/14/14/20";
    }

    let url =
        base +
        mapStyle +
        "/" +
        anno +
        mese +
        giorno +
        time +
        zone +
        "?outputtype=jpeg";
    i = i + 1;

    return { url, time};
}

export { getUrl };
export { overlayItaly };
export { overlayEurope };
export { minutes };
export { offset };
export { minuti }