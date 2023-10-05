export type Reducer<TStore, TAction> = (
  store: TStore,
  action: TAction
) => TStore

export type Listener<TStore> = {
  selectorFn: (store: TStore) => TStore
  updater: (store: () => Partial<TStore>) => void
}

export type SetStoreAction<TStore> = TStore | ((store: TStore) => TStore)
