jest.mock("../dataLayer/utils/DButils");
const referees_domain = require("./referees_domain");
const mockDButils = require("../dataLayer/utils/DButils");

const mockExecQuery = (mockFunc) =>
  mockDButils.execQuery.mockImplementationOnce(mockFunc);

const mockError = async () => {
  throw new Error("some network issue occured");
};

describe("CreateReferee", () => {
  beforeEach(() => jest.resetAllMocks());

  const req = {
    body: {
      userName: "amitush",
      firstName: "amit",
      lastName: "ostrov",
      country: "Israel",
      password: "123456",
      email: "amit@gmail.com",
      matchId: "123",
    },
  };

  const user = {
    username: "amit",
    firstName: "Amit",
    lastName: "Ostrov",
    country: "Israel",
    password: "123456",
    email: "amit@blabla.com",
    image: "",
  };

  test("should throw an error when referee does not created in the db", async () => {
    mockExecQuery(mockError);
    await expect(referees_domain.CreateReferee(req)).rejects.toThrow();
  });

  test("should throw an error when match id does not exists in the db", async () => {
    const mockUser = user;
    const refereeId = 123;
    mockExecQuery(async () => mockUser);
    mockExecQuery(async () => mockUser);
    mockExecQuery(async () => [{ userId: "someId" }]);

    mockExecQuery(async () => []); // referee not exists

    mockExecQuery(async () => true);
    mockExecQuery(async () => [{ refereeId }]); // referee exists

    mockExecQuery(async () => []);
    // mockExecQuery(async () => true);
    await expect(referees_domain.CreateReferee(req)).rejects.toThrow();
  });

  test("should return true when assigning referee succeed", async () => {
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
    const mockUser = user;
    const refereeId = 123;
    mockExecQuery(async () => mockUser);
    mockExecQuery(async () => mockUser);
    mockExecQuery(async () => [{ userId: "someId" }]);

    // mockExecQuery(async () => [{ refereeId }]);// referee exists
    mockExecQuery(async () => []); // referee not exists

    mockExecQuery(async () => true);
    mockExecQuery(async () => [{ refereeId }]); // referee exists

    // mockExecQuery(async () => true);
    mockExecQuery(async () => [match]);
    mockExecQuery(async () => true);

    const result = await referees_domain.CreateReferee(req);
    expect(result).toBe(true);
  });
});

describe("getReferees", () => {
  beforeEach(() => jest.resetAllMocks());
  test("should return all referees from the db", async () => {
    const mockReferees = [
      { id: 11, username: "Amit" },
      { id: 13, username: "Gal" },
    ];
    mockExecQuery(() => mockReferees);
    const result = await referees_domain.getReferees();
    expect(result).toEqual(mockReferees);
  });

  test("should return an error", async () => {
    mockExecQuery(mockError);
    await expect(referees_domain.getReferees()).rejects.toThrow();
  });
});
