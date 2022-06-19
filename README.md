# React Superstore - A React Global State Hook

Simple hook for adding and managing global state in your react app.

### Installation

```bash
npm install react-superstore
```

## Usage

Create a store anywhere in your app and pass in an initial state as the first argument in your createStore function and an optional reducer as the second argument. You can create as many instances as you like. The `createStore` function returns 3 functions in an array `[useStore, dispatch, getStore]`:

1. `useStore()` which is to be used in your react component to use the store value. This is the function that will re-render your component when the store value changes <b>This is a react hook and will need to be used in a react function component.</b>

2. `dispatch()` which sets the store and can be used anywhere in your app. This can be used just like reacts `setState`. You can set the store directly like `dispatch(newStore)` or pass a function that has the current store value as an argument and return your new store value to set it `dispatch(currentStore => currentStore + 1)`. If you pass in a reducer then the reducer will be used to set the store instead.

3. `getStore()` which can be used anywhere in your app to get the store value.

## Simple Pattern Usage

Lets show some examples. We will make a simple counter.

The function returns an array of the 3 functions so you can destructure them and call them whatever you like. In this case we will extract the useStore, dispatch and getStore functions and call them useCount, setCount and getCount.

Create a store somewhere in your app.

```js
import createStore from 'react-superstore'

export const [useCount, setCount, getCount] = createStore(0)
```

Consume in your react component.

```js
import { useCount, setCount } from 'location of your store'

const Counter = () => {
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

You can pass a reducer as the second argument in your `createStore` function and then the `dispatch` funciton will use the reducer to set the store.

```js
import createStore from 'react-superstore'

const reducer = (store, action) {
  switch(action.type){
    case 'INCREASE':
      return store + 1
    default:
      return store
  }
}

export const [ useCount, dispatchCount ] = createStore(0, reducer)
```

Consume in your component and use just like the simple example above but now you will use the reducer when you call your `dispatch` function.

```js
import { useCount, dispatchCount } from 'location of your store'

const Counter = () => {
  const count = useCount()

  const handleClick = () => dispatchCount({ type: 'INCREASE' })

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+</button>
    </>
  )
}
```

## Maximize Performance And Avoid Unwanted Re-Renders

By default the `useStore()` hook returns then entire store and shallow compares the keys of the store on dispatch. You can pass in a function to return only the values that you want to use in your component. The function should include one argument that will give you the store value and then you should return the values that you want to use. Eg. `const foo = useStore(store => store.foo)`. Consider the following example.

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

const ReactComponent = () => {
  const foo = useStore((store) => store.foo)

  return <p>Foo: {foo}</p>
}
```

Or you can return an object and the dispatch function will shallow compare values for equality. In the following you can map the foo and bar values to your component and then you can avoid re-renders if the baz value changes.

```js
import { useStore } from 'location of your store'

const ReactComponent = () => {
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

## License

Distributed under the MIT License. See `LICENSE` for more information.
