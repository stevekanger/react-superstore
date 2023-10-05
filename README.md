# React Superstore - A React Global State Hook

Simple hook for adding and managing global state in your react app. You can get and set values from anywhere in your app.

- [Installation](#installation)
- [Usage](#usage)
- [Simple Pattern Usage](#simple-pattern-usage)
- [Reducer Pattern Usage](#reducer-pattern-usage)
- [Maximize Performance And Avoid ReRenders](#maximize-performance-and-avoid-unwanted-re-renders)
- [Usage With Typescript](#usage-with-typescript)
- [Liscence](#license)

### Installation

Latest requirements are React >= 18.0.0

```bash
npm install react-superstore
```

For older versions minimum requirements are React versions with the `useEffect` hook 16.8.0 - 17.0.2

```bash
npm install react-superstore@0.0.8
```

## Usage

Create a store anywhere in your app and pass in an initial state as the first argument in your createStore function and an optional reducer as the second argument. You can create as many instances as you like. The `createStore` function returns 3 functions in an array `[useStore, setStore, getStore]`:

1. `useStore()` which is to be used in your react component to use the store value. This is the function that will re-render your component when the store value changes <b>This is a react hook and will need to be used in a react function component.</b>

2. `setStore()` which sets the store and can be used anywhere in your app inside or outside of a react compoonent. This can be used just like reacts `setState`. You can set the store directly like `setStore(newStore)` or pass a function that has the current store value as an argument and return your new store value to set it `setStore(currentStore => currentStore + 1)`. If you pass in a reducer then the reducer will be used to set the store instead.

3. `getStore()` which can be used anywhere in your app inside or outside of a react component to get the store value. You can use this inside a react component but it won't cause a re render of the component.

## Simple Pattern Usage

Lets show some examples. We will make a simple counter.

The function returns an array of the 3 functions so you can destructure them and call them whatever you like. In this case we will extract the useStore, setStore and getStore functions and call them useCount, setCount and getCount.

Create a store somewhere in your app.

```js
import createStore from 'react-superstore'

export const [useCount, setCount, getCount] = createStore(0)
```

Consume in your react component.

```js
import { useCount, setCount } from 'location of your store'

function Counter() {
  const count = useCount()

  const handleClick = () => setCount(count + 1)

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+</button>
    </>
  )
}
```

## Reducer Pattern Usage

You can pass a reducer as the second argument in your `createStore` function and then the `setStore` function will use the reducer to set the store.

```js
import createStore from 'react-superstore'

function reducer(store, action) {
  switch (action.type) {
    case 'INCREASE':
      return store + 1
    default:
      return store
  }
}

export const [useCount, setCount] = createStore(0, reducer)
```

Consume in your component and use just like the simple example above but now you will use the reducer when you call your `dispatch` function.

```js
import { useCount, setCount } from 'location of your store'

function Counter() {
  const count = useCount()

  const handleClick = () => setCount({ type: 'INCREASE' })

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+</button>
    </>
  )
}
```

## Maximize Performance And Avoid Unwanted Re-Renders

By default the `useStore()` hook returns then entire store. You can pass in a selector function to return only the values that you want to use in your component. This will trigger a shallow compare when setting the store that compares the previous store to the new store. The selector function should include one argument that will be the current store value and then you should return the values that you want to use. Eg. `const foo = useStore(store => store.foo)`. Consider the following example.

```js
import createStore from 'react-superstore'

const intialStore = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
}

export const [useStore] = createStore(initialStore)
```

In your react component you can do the following and your component will only re-render if the foo value changes. If the bar or baz values change your component will not re-render.

```js
import { useStore } from 'location of your store'

function ReactComponent() {
  const foo = useStore((store) => store.foo)

  return <p>Foo: {foo}</p>
}
```

Or you can return an object and the dispatch function will shallow compare values for equality. In the following you can map the foo and bar values to your component and then you can avoid re-renders if the baz value changes.

```js
import { useStore } from 'location of your store'

function ReactComponent() {
  const { foo, bar } = useStore((store) => {
    return {
      foo: store.foo,
      bar: store.bar,
    }
  })

  return (
    <p>
      Foo: {foo} - Bar: {bar}
    </p>
  )
}
```

## Usage With Typescript

Stores are fully typescript compatible. When you create a store just pass in the store type to get your types inferred while using the store.

### Simple Example Typescript

```typescript
import createStore from 'react-superstore'

export const [useCount, setCount, getCount] = createStore<number>(0)
```

### Complex Store Example Typescript

```typescript
import createStore from 'react-superstore'

type Store = {
  foo: string
  bar: string
  baz: string
}

export const [useStore, setStore, getStore] = createStore<Store>({
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
})
```

### Reducer Store Example Typescript

Create a store type and an action type. Pass both in when creating the store. `createStore<Store, Action>(...your store)`.

```typescript
import createStore from 'react-superstore'

type Store = {
  foo: string
  bar: string
  baz: string
}

type Action = {
  type: string
  payload: any
}

function reducer(store: Store, action: Action): Store {
  switch (action.type) {
    case 'SET_BAZ':
      return {
        ...store,
        baz: action.payload,
      }
    default:
      return store
  }
}

export const [useStore, setStore, getStore] = createStore<Store, Action>(
  {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
  },
  reducer
)
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
