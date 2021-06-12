jest.mock("../utils/DButils");
const matches_utils = require("../utils/matches_utils");
const mockDButils = require("../utils/DButils");

const mockExecQuery = (mockFunc) =>
  mockDButils.execQuery.mockImplementation(mockFunc);

const mockError = async () => {
  throw new Error("some network issue occured");
};

describe("getMatches", () => {
  beforeEach(() => jest.resetAllMocks());

  test("should find and return matches", async () => {
    const mockMatches = [
      {
        matchId: 2222,
        leagueId: "48",
        seasonId: "32",
        stageId: 66,
        matchDate: "12/3/20",
        matchHour: "18:30",
        homeTeam: "Macabi",
        awayTeam: "Hapoel",
        stadium: "Blumfild",
        refereeId: 1,
        score: "3-0",
      },
    ];
    mockExecQuery(async () => mockMatches);
    const result = await matches_utils.getMatches();
    expect(result).toEqual(mockMatches);
  });

  test("should not find matches", async () => {
    const mockMatches = [];
    mockExecQuery(async () => mockMatches);
    const result = await matches_utils.getMatches();
    expect(result).toEqual(mockMatches);
  });

  test("should check query", async () => {
    const mockMatches = [];
    const mockedImp = mockExecQuery(async () => mockMatches);
    await matches_utils.getMatches(mockMatches);
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(`select * from dbo.matches`);
  });

  test("should return an error", async () => {
    mockExecQuery(mockError);
    await expect(matches_utils.getMatches()).rejects.toThrow();
  });
});

describe("UpdateRefereeToMatch", () => {
  beforeEach(() => jest.resetAllMocks());

  const mockMatches = [
    {
      matchId: 2222,
      leagueId: "48",
      seasonId: "32",
      stageId: 66,
      matchDate: "12/3/20",
      matchHour: "18:30",
      homeTeam: "Macabi",
      awayTeam: "Hapoel",
      stadium: "Blumfild",
      refereeId: 1,
      score: "3-0",
    },
  ];

  test("should succeed update referee to match", async () => {
    mockExecQuery(async () => true);
    const result = await matches_utils.UpdateRefereeToMatch(
      mockMatches[0].matchId,
      2
    );
    expect(result).toBe(true);
  });

  test("should not succeed update referee to match", async () => {
    mockExecQuery(mockError);
    const result = await matches_utils.UpdateRefereeToMatch(
      mockMatches[0].matchId,
      2
    );
    expect(result).toBe(false);
  });

  test("should check query", async () => {
    const mockedImp = mockExecQuery(async () => true);
    await matches_utils.UpdateRefereeToMatch(mockMatches[0].matchId, 2);
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(
      `UPDATE dbo.matches SET refereeId = 2 WHERE matchId = 2222;`
    );
  });
});
