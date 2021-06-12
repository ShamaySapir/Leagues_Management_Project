jest.mock("../dataLayer/utils/DButils");
const auth_domain = require("./auth_domain");
const mockDButils = require("../dataLayer/utils/DButils");

const mockExecQuery = (mockFunc) =>
  mockDButils.execQuery.mockImplementation(mockFunc);

const mockError = async () => {
  throw new Error("some network issue occured");
};

describe("login", () => {
  beforeEach(() => jest.resetAllMocks());
  test("should succeed login and return userId", async () => {
    const user = { userId: 123, username: "sapir", password: "220812" };
    mockExecQuery(() => [user]);
    const result = await auth_domain.login(user.username, user.password);
    expect(result).toEqual(user.userId);
  });

  test("should return an error when password is incorrect", async () => {
    const user = { userId: 123, username: "sapir", password: "220812" };
    mockExecQuery(() => [user]);
    const result = await auth_domain.login(user.username, `${user.password}1`);
    expect(result).toBe(false);
  });

  test("should return an error", async () => {
    mockExecQuery(mockError);
    await expect(auth_domain.login("1", "2")).rejects.toThrow();
  });
});

describe("userRegister", () => {
  beforeEach(() => jest.resetAllMocks());
  test("should succeed registering user", async () => {
    const user = { userId: 123, username: "sapir", password: "220812" };
    mockExecQuery(() => null);
    const result = await auth_domain.userRegister(user);
    expect(result).toEqual(user);
  });
  test("should fail registering user if exists", async () => {
    const user = { userId: 123, username: "sapir", password: "220812" };
    mockExecQuery(() => [user]);
    await expect(auth_domain.userRegister(user)).rejects.toThrow();
  });

  test("should return an error", async () => {
    mockExecQuery(mockError);
    await expect(
      auth_domain.userRegister({ username: "sapir" })
    ).rejects.toThrow();
  });

  test("should return an error if user is not in correct form", async () => {
    mockExecQuery(mockError);
    await expect(auth_domain.userRegister()).rejects.toThrow();
  });
});

describe("getUsers", () => {
  beforeEach(() => jest.resetAllMocks());
  test("should get all db users", async () => {
    const user = { userId: 123, username: "sapir", password: "220812" };
    mockExecQuery(() => [user, user]);
    const result = await auth_domain.getUsers(user);
    expect(result).toEqual([user, user]);
  });

  test("should return an error when exception raised", async () => {
    mockExecQuery(mockError);
    await expect(auth_domain.getUsers()).rejects.toThrow();
  });
});
