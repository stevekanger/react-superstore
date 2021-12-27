# React Global Store Hook

Simple hook for adding a global state to your react app.

### Installation

It's a simple script just copy createStore.js and add it to your project.

## Simple Pattern Usage

Create a simple store anywhere in your app and pass in an initial state as the first argument in your createStore function. You can create as many instances as you like. The `createStore` function returns 3 functions in an array:

1. `useStore()` which is to be used in your react component to use the store value. This is the function that will re render your component when the store value changes. <b>This is a react hook and will need to be used in a react component.</b>

2. `dispatch()` which sets the store and can also be used anywhere in your app. This can be used just like reacts `setState`. You can set the store directly like `dispatch(newStore)` or pass a function that has the current store value as an argument and return your new store value to set it `dispatch(currentStore => currentStore + 1)`.

3. `getStore()` which can be used anywhere in your app to get the store value.

Lets show some examples. We will make a simple counter.

The function returns an array of the 3 functions so you can destructure them and call them whatever you like. In this case we will extract the useStore, dispatch and getStore functions and call them useCount, setCount and getCount.

```js
import createStore from 'location of the pasted script'

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
import createStore from 'location of the pasted script'

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

## Avoid Unwanted Re Renders

The `useStore` hook can accept an empty or `null` value that will re render your component anytime a value in the store has changed. Or pass in the object keys you want to use in your component in string format `('key1', 'key2')` and this will allow the component to re render only if one of these keys in the store object has changed <b>(Only works if you have an object as your store)</b>. So if you have a complex store object you can control what keys your component re renders for. Say you have the following store object.

```js
import createStore from 'location of the pasted script'

const intialState = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
}

export const [useStore] = createStore(initialState)
```

In your react component you can do the following and your component will only re render if the foo or bar values have changed. If the baz value changes your component will not re render.

```js
import { useStore } from 'location of your store'

const ReactComponent = () => {
  const store = useStore('foo', 'bar')

  return (
    <p>
      Foo: {store.foo} Bar: {store.bar}
    </p>
  )
}
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
