conn = new Mongo();
db = conn.getDB("dev");

const codeList = [
  "YpDOPX",
  "NbJEUt",
  "JLh4VN",
  "WFyCzt",
  "yDq71D",
  "RKwjcV",
  "550J98",
  "03NoAH",
  "UDerEw",
  "nzE4nD",
];

for (let idx in codeList) {
  db.codes.insert({
    code: codeList[idx],
    inUsage: false
  });
}
