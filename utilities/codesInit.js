conn = new Mongo();
db = conn.getDB("check-in-data");

const codeList = [
  "Jvt6g5",
  "mbHJzf",
  "qkTtzM",
  "ap9rSO",
  "Ene70u",
  "kqW6qj",
  "tAGVuc",
  "eJfIDe",
  "oHAWSX",
  "ZCyDvA",
  "WVVMmU",
  "E6YBQO",
  "B2n2CU",
  "lU8Sg0",
  "IUPTWj",
  "T9uQ44",
  "lNFRax",
  "N2uU5v",
  "qmx5Om",
  "rGldPL",
  "AJbfqr",
  "tyWATX",
  "Gl9PGn",
  "2dKyYD",
  "FC2qER",
  "JV9DJg",
  "5x52xF",
  "48ZpwD",
  "aGrp47",
  "fguk2u",
  "ynTEcx",
  "bjJ0Ik",
  "hez7bm",
  "tEBahc",
  "ePy9sq",
  "dINRQI",
  "GzGFap",
  "Lnaitg",
  "yR7Bw7",
  "HPX9sj",
  "DQ9hqH",
  "Osi9x1",
  "4DBzSD",
  "09UgDH",
  "2iMSvw",
  "2Eib6B",
  "jCjltJ",
  "z2uFIB",
  "znXau3",
  "GWldlA",
];

for (let idx in codeList) {
  db.codes.insert({
    code: codeList[idx],
    inUsage: false,
  });
}
