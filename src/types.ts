export type UpdaterFn<TStore> = (state: () => Partial<TStore>) => void

export type Reducer<TStore, TAction> = (
  store: TStore,
  action: TAction
) => TStore

export type Listener<TStore> = {
  selectorFn: (store: TStore) => TStore
  updater: UpdaterFn<TStore>
}

export type SetStoreAction<TStore> = TStore | ((store: TStore) => TStore)
