const mssql = require("mssql");
jest.mock("mssql");

mssql.ConnectionPool = jest.fn();
const queryResult = jest
  .fn()
  .mockImplementation(() => ({ recordset: [{ username: "sapir" }] }));
mssql.ConnectionPool.mockImplementation(() => ({
  connect: async () => {},
  request: () => ({ query: queryResult }),
}));
const DButils = require("../utils/DButils");

describe("execQuery", () => {
  test("should return query with the right format", async () => {
    const query = `SELECT * FROM dbo.Users`;
    const result = await DButils.execQuery(query);
    expect(result).toEqual([{ username: "sapir" }]);
    const queryArgs = queryResult.mock.calls[0][0];
    expect(queryArgs).toEqual(query);
  });
});

// const mockError = async () => {
//   throw new Error("some network issue occured");
// };

// test("should return an error", async () => {
//   await expect(DButils.execQuery("ran")).rejects.toThrow();
// });
