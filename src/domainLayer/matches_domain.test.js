jest.mock("../dataLayer/utils/DButils");
const matches_domain = require("./matches_domain");
const mockDButils = require("../dataLayer/utils/DButils");

const mockExecQuery = (mockFunc) =>
  mockDButils.execQuery.mockImplementation(mockFunc);

const mockError = async () => {
  throw new Error("some network issue occured");
};

describe("UserIsUnionRep", () => {
  beforeEach(() => jest.resetAllMocks());
  test("should return false when union rep user does not exists in the db", async () => {
    mockExecQuery(() => null);
    const result = await matches_domain.UserIsUnionRep("someNotExistingId");
    expect(result).toBe(false);
  });

  test("should return true when union rep user exists in the db", async () => {
    mockExecQuery(() => ["something"]);
    const result = await matches_domain.UserIsUnionRep("someNotExistingId");
    expect(result).toBe(true);
  });

  test("should return an error", async () => {
    mockExecQuery(mockError);
    await expect(
      matches_domain.UserIsUnionRep("someNotExistingId")
    ).rejects.toThrow();
  });
});

describe("getMatches", () => {
  beforeEach(() => jest.resetAllMocks());
  test("should return all matches from the db", async () => {
    const match = {
      matchId: "123",
      leagueId: "123",
      seasonId: "123",
      stageId: 1,
      matchDate: new Date(),
      matchHour: "11",
      homeTeam: "t1",
      awayTeam: "t2",
      stadium: "st1",
      refereeId: 3,
      score: "999",
    };
    mockExecQuery(() => [match]);
    const result = await matches_domain.getMatches();
    expect(result).toEqual([match]);
  });

  test("should return an error", async () => {
    mockExecQuery(mockError);
    await expect(matches_domain.getMatches()).rejects.toThrow();
  });
});
