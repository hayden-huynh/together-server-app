conn = new Mongo();
db = conn.getDB("check-in-data");

const codeList = [
  "mJgAqk",
  "zxcygv",
  "YqaoiL",
  "c8jFnc",
  "udfptz",
  "kgxusJ",
  "70ncK4",
  "NY40GW",
  "zRS9Z1",
  "PrTcoD",
  "G8RdY8",
  "TWsB0k",
  "qgXvMI",
  "JOD9V9",
  "7ekvEY",
  "vUTJK0",
  "UE0b8o",
  "rv5hh6",
  "qjIUxn",
  "FUEI0h",
  "m3w7QK",
  "7ss2aT",
  "kEc8i3",
  "qEt6pe",
  "d6XedO",
  "KZ2d96",
  "nP48M7",
  "Dd5gbA",
  "oRp7eI",
  "sIilOd",
  "IDebMf",
  "SUWGNh",
  "ikzkvt",
  "VAwEUX",
  "L4xe3K",
  "ArhlVW",
  "Tcqv1A",
  "ziZOms",
  "nKaI1y",
  "K5Sq0S",
];

for (let idx in codeList) {
  db.codes.insert({
    code: codeList[idx],
    inUsage: false,
  });
}
