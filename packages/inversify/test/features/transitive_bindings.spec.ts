import {
  Container,
  injectable,
  interfaces,
  multiBindToService,
} from "../../src";

describe("Transitive bindings", () => {
  it("Should be able to bind to a service", () => {
    @injectable()
    class MySqlDatabaseTransactionLog {
      public time: number;
      public name: string;
      constructor() {
        this.time = new Date().getTime();
        this.name = "MySqlDatabaseTransactionLog";
      }
    }

    @injectable()
    class DatabaseTransactionLog {
      public time!: number;
      public name!: string;
    }

    @injectable()
    class TransactionLog {
      public time!: number;
      public name!: string;
    }

    const container: Container = new Container();
    container.bind(MySqlDatabaseTransactionLog).toSelf().inSingletonScope();
    container
      .bind(DatabaseTransactionLog)
      .toService(MySqlDatabaseTransactionLog);
    container.bind(TransactionLog).toService(DatabaseTransactionLog);

    const mySqlDatabaseTransactionLog: MySqlDatabaseTransactionLog =
      container.get(MySqlDatabaseTransactionLog);
    const databaseTransactionLog: DatabaseTransactionLog = container.get(
      DatabaseTransactionLog
    );
    const transactionLog: TransactionLog = container.get(TransactionLog);

    expect(mySqlDatabaseTransactionLog.name).toBe(
      "MySqlDatabaseTransactionLog"
    );
    expect(databaseTransactionLog.name).toBe("MySqlDatabaseTransactionLog");
    expect(transactionLog.name).toBe("MySqlDatabaseTransactionLog");
    expect(mySqlDatabaseTransactionLog.time).toBe(databaseTransactionLog.time);
    expect(databaseTransactionLog.time).toBe(transactionLog.time);
  });

  it("Should be able to bulk bind to a service", () => {
    @injectable()
    class MySqlDatabaseTransactionLog {
      public time: number;
      public name: string;
      constructor() {
        this.time = new Date().getTime();
        this.name = "MySqlDatabaseTransactionLog";
      }
    }

    @injectable()
    class DatabaseTransactionLog {
      public time!: number;
      public name!: string;
    }

    @injectable()
    class TransactionLog {
      public time!: number;
      public name!: string;
    }

    const container: Container = new Container();
    const mbts: (
      service: interfaces.ServiceIdentifier
    ) => (...types: interfaces.ServiceIdentifier[]) => void =
      multiBindToService(container);
    container.bind(MySqlDatabaseTransactionLog).toSelf().inSingletonScope();
    mbts(MySqlDatabaseTransactionLog)(DatabaseTransactionLog, TransactionLog);

    const mySqlDatabaseTransactionLog: MySqlDatabaseTransactionLog =
      container.get(MySqlDatabaseTransactionLog);
    const databaseTransactionLog: DatabaseTransactionLog = container.get(
      DatabaseTransactionLog
    );
    const transactionLog: TransactionLog = container.get(TransactionLog);

    expect(mySqlDatabaseTransactionLog.name).toBe(
      "MySqlDatabaseTransactionLog"
    );
    expect(databaseTransactionLog.name).toBe("MySqlDatabaseTransactionLog");
    expect(transactionLog.name).toBe("MySqlDatabaseTransactionLog");
    expect(mySqlDatabaseTransactionLog.time).toBe(databaseTransactionLog.time);
    expect(databaseTransactionLog.time).toBe(transactionLog.time);
  });
});
