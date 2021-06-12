const mssql = require("mssql");
jest.mock("mssql");

const mockError = async () => {
  throw new Error("some network issue occured");
};

mssql.ConnectionPool = jest.fn();
const queryResult = jest
  .fn()
  .mockImplementationOnce(() => ({ recordset: [{ username: "sapir" }] }))
  .mockImplementationOnce(mockError);
mssql.ConnectionPool.mockImplementation(() => ({
  connect: async () => {},
  request: () => ({ query: queryResult }),
}));
const DButils = require("../utils/DButils");
const query = `SELECT username FROM dbo.Users`;

describe("execQuery", () => {
  test("should return query with the right format", async () => {
    const result = await DButils.execQuery(query);
    expect(result).toEqual([{ username: "sapir" }]);
    const queryArgs = queryResult.mock.calls[0][0];
    expect(queryArgs).toEqual(query);
  });

  test("should return an error", async () => {
    await expect(DButils.execQuery(query)).rejects.toThrow();
  });
});
