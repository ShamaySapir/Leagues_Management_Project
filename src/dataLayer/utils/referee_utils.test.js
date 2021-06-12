jest.mock("../utils/DButils");
const referee_utils = require("../utils/referee_utils");
const mockDButils = require("../utils/DButils");

const mockExecQuery = (mockFunc) =>
  mockDButils.execQuery.mockImplementation(mockFunc);

const mockError = async () => {
  throw new Error("some network issue occured");
};

describe("insertRefereeInfo", () => {
  beforeEach(() => jest.resetAllMocks());

  const referee = {
    id: 11,
    username: "Amit",
  };

  test("should insert referee info", async () => {
    const mockReferee = referee;
    mockExecQuery(async () => true);
    const result = await referee_utils.insertRefereeInfo(
      mockReferee.id,
      mockReferee.username
    );
    expect(result).toBe(true);
  });

  test("should check query", async () => {
    const mockReferee = referee;
    const mockedImp = mockExecQuery(async () => true);
    await referee_utils.insertRefereeInfo(mockReferee.id, mockReferee.username);
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(
      `INSERT INTO dbo.Referees (userId, username) VALUES (11, 'Amit');`
    );
  });

  test("should return an error", async () => {
    const mockReferee = referee;
    mockExecQuery(mockError);
    await expect(
      referee_utils.insertRefereeInfo(mockReferee.id, mockReferee.username)
    ).rejects.toThrow();
  });
});

describe("getRefereeID", () => {
  beforeEach(() => jest.resetAllMocks());

  const referee = {
    id: 11,
    username: "Amit",
  };

  test("should find referee and return refereeId", async () => {
    const mockRefereeId = [{ refereeId: 11 }];
    mockExecQuery(async () => mockRefereeId);
    const result = await referee_utils.getRefereeID(referee.username);
    expect(result).toEqual(11);
  });

  test("should check query", async () => {
    const mockRefereeId = [{ refereeId: 11 }];
    const mockedImp = mockExecQuery(async () => mockRefereeId);
    await referee_utils.getRefereeID(referee.username);
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(
      `SELECT * from dbo.Referees WHERE username = 'Amit';`
    );
  });

  test("should not find referee and return an error", async () => {
    mockExecQuery(async () => null);
    await expect(
      referee_utils.getRefereeID(referee.username)
    ).rejects.toThrow();
  });

  test("should return an error", async () => {
    mockExecQuery(mockError);
    await expect(
      referee_utils.getRefereeID(referee.username)
    ).rejects.toThrow();
  });
});

describe("getReferees", () => {
  beforeEach(() => jest.resetAllMocks());

  test("should find and return referees", async () => {
    const mockReferees = [
      { id: 11, username: "Amit" },
      { id: 13, username: "Gal" },
    ];
    mockExecQuery(async () => mockReferees);
    const result = await referee_utils.getReferees();
    expect(result).toEqual(mockReferees);
  });

  test("should check query", async () => {
    const mockReferees = [];
    const mockedImp = mockExecQuery(async () => mockReferees);
    await referee_utils.getReferees();
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(
      `SELECT [refereeId], [userId], [username] from dbo.Referees;`
    );
  });

  test("should not find referees", async () => {
    const mockReferees = [];
    mockExecQuery(async () => mockReferees);
    const result = await referee_utils.getReferees();
    expect(result).toEqual(mockReferees);
  });
});
