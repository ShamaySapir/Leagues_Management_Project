jest.mock("../utils/DButils");
const auth_utils = require("../utils/auth_utils");
const mockDButils = require("../utils/DButils");

describe.only("getUserInfo", () => {
  const mockExecQuery = (mockUserInfo) => {
    mockDButils.execQuery.mockImplementation(mockUserInfo);
  };

  test("should find and return user info", async () => {
    const mockUserInfo = ["amit"];
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("amit");
    expect(result).toEqual("amit");
  });

  test("should not find user and return error", async () => {
    const mockUserInfo = null;
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("sapir");
    expect(result).toBeNull();
  });

  test("should return error of timeout", async () => {
    const mockUserInfo = async () => {
      throw new Error("some network issue occured");
    };
    mockExecQuery(mockUserInfo);
    await expect(auth_utils.getUserInfo("ran")).rejects.toThrow();
  });
});

describe("insertUserInfo", () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test("Vienna <3 veal", () => {
    expect(isValidCityFoodPair("Vienna", "Wiener Schnitzel")).toBe(true);
  });

  test("San Juan <3 plantains", () => {
    expect(isValidCityFoodPair("San Juan", "Mofongo")).toBe(true);
  });
});

describe("getUserId", () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test("Vienna <3 veal", () => {
    expect(isValidCityFoodPair("Vienna", "Wiener Schnitzel")).toBe(true);
  });

  test("San Juan <3 plantains", () => {
    expect(isValidCityFoodPair("San Juan", "Mofongo")).toBe(true);
  });
});

describe("checkUnionRep", () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test("Vienna <3 veal", () => {
    expect(isValidCityFoodPair("Vienna", "Wiener Schnitzel")).toBe(true);
  });

  test("San Juan <3 plantains", () => {
    expect(isValidCityFoodPair("San Juan", "Mofongo")).toBe(true);
  });
});

describe("getUsers", () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test("Vienna <3 veal", () => {
    expect(isValidCityFoodPair("Vienna", "Wiener Schnitzel")).toBe(true);
  });

  test("San Juan <3 plantains", () => {
    expect(isValidCityFoodPair("San Juan", "Mofongo")).toBe(true);
  });
});
