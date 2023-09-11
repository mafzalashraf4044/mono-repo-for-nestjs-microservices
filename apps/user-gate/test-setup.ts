jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  initializeTransactionalContext: () => ({}),
  patchTypeORMRepositoryWithBaseRepository: () => ({}),
  BaseRepository: class {},
  IsolationLevel: {
    SERIALIZABLE: 'SERIALIZABLE',
    READ_COMMITTED: 'READ_COMMITTED',
  },
}));
