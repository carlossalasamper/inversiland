import { expect } from 'chai';

import {
  Container,
  injectable,
  interfaces,
  multiBindToService,
} from '../../src/inversify';

describe('Transitive bindings', () => {
  it('Should be able to bind to a service', () => {
    @injectable()
    class MySqlDatabaseTransactionLog {
      public time: number;
      public name: string;
      constructor() {
        this.time = new Date().getTime();
        this.name = 'MySqlDatabaseTransactionLog';
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
      DatabaseTransactionLog,
    );
    const transactionLog: TransactionLog = container.get(TransactionLog);

    expect(mySqlDatabaseTransactionLog.name).to.eq(
      'MySqlDatabaseTransactionLog',
    );
    expect(databaseTransactionLog.name).to.eq('MySqlDatabaseTransactionLog');
    expect(transactionLog.name).to.eq('MySqlDatabaseTransactionLog');
    expect(mySqlDatabaseTransactionLog.time).to.eq(databaseTransactionLog.time);
    expect(databaseTransactionLog.time).to.eq(transactionLog.time);
  });

  it('Should be able to bulk bind to a service', () => {
    @injectable()
    class MySqlDatabaseTransactionLog {
      public time: number;
      public name: string;
      constructor() {
        this.time = new Date().getTime();
        this.name = 'MySqlDatabaseTransactionLog';
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
      service: interfaces.ServiceIdentifier,
    ) => (...types: interfaces.ServiceIdentifier[]) => void =
      multiBindToService(container);
    container.bind(MySqlDatabaseTransactionLog).toSelf().inSingletonScope();
    mbts(MySqlDatabaseTransactionLog)(DatabaseTransactionLog, TransactionLog);

    const mySqlDatabaseTransactionLog: MySqlDatabaseTransactionLog =
      container.get(MySqlDatabaseTransactionLog);
    const databaseTransactionLog: DatabaseTransactionLog = container.get(
      DatabaseTransactionLog,
    );
    const transactionLog: TransactionLog = container.get(TransactionLog);

    expect(mySqlDatabaseTransactionLog.name).to.eq(
      'MySqlDatabaseTransactionLog',
    );
    expect(databaseTransactionLog.name).to.eq('MySqlDatabaseTransactionLog');
    expect(transactionLog.name).to.eq('MySqlDatabaseTransactionLog');
    expect(mySqlDatabaseTransactionLog.time).to.eq(databaseTransactionLog.time);
    expect(databaseTransactionLog.time).to.eq(transactionLog.time);
  });
});
