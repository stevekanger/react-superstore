# React Global Store Hook

Simple hook for adding a global state to your react app.

### Installation

It's a simple script just copy createStore.js and add it to your project.

## Simple Pattern Usage

Create a simple store anywhere in your app and pass in an initial state as the first argument in your createStore function. Create as many instances you like. For the examples we will make a simple counter.

```js
import createStore from 'location of the pasted script'

export const useCount = createStore(0)
```

Consume in your react component and use just like reacts useState structure where the first value in the array is the stored state and the second value is the setting function. The setting function can be used just like in react. You can set the store directly like `setCount(2)` or if you pass a function it will return the previous store and you can return the new store like `setCount(count => count + 1)`.

```js
import { useCount } from 'location of your store'

const Counter = () => {
  const [count, setCount] = useCount()

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

Create a store and a reducer. Pass the reducer as the second argument in your createStore function.

```js
import createStore from 'location of the pasted script'

const reducer = (state, action) {
  switch(action.type){
    case 'INCREASE':
      return state + 1
    default:
      return state
  }
}

export const useCount = createStore(0, reducer)
```

Consume in your component and use just like the simple example above but now you can use the second value as a dispatch to your reducer. The naming is not important you can call the setStore/dispatch function whatever you like. If you pass in a reducer it will use the reducer to set the store. If you don't pass a reducer it will set the store normally like the above example.

```js
import { useCount } from 'location of your store'

const Counter = () => {
  const [count, dispatch] = useCount()

  const handleClick = () => dispatch({ type: 'INCREASE' })

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+</button>
    </>
  )
}
```

## Add actions to your store

When creating your store you can pass an object with actions as the third argument if you want to decouple the actions from your components. The function will first pass the `(setStore, getStore)` functions to your action and then return your action function. If you pass in a reducer you can use the setStore function to dispatch to your reducer just like the before example. <b>Note: the `setStore` function will be passed before the `getStore` function to your action because it is used more often.</b>

```js
import createStore from 'location of the pasted script'

const increase = (setCount, getCount) => () => {
  const count = getCount()
  setCount(count + 1)
}

export const useCount = createStore(initialState, null, { increase })
```

Then consume in your component just like the examples before but now the third value in the array is your actions.

```js
import { useCount } from 'location of your store'

const Counter = () => {
  const [count, , actions] = useCount()

  const handleClick = () => actions.increase()

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+</button>
    </>
  )
}
```

## Avoid Unwanted Re Renders

The hook can accept an empty or `null` value that will re render your component anytime a value in the store has changed. Or pass in the object keys you want to use in your component in string format `('key1', 'key2')` and this will allow the component to re render only if one of these keys in the store object has changed (Only works if you have an object as your store). So if you have a complex store object you can control what keys your component re renders for. Say you have the following store object.

```js
import createStore from 'location of the pasted script'

const intialState = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
}

export const useStore = createStore(initialState)
```

In your react component you can do the following and your component will only re render if the foo or bar values have changed. If the baz value changes your component will not re render.

```js
import { useStore } from 'location of your store'

const ReactComponent = () => {
  const [store, setStore] = useStore('foo', 'bar')

  return (
    <p>
      Foo: {store.foo} Bar: {store.bar}
    </p>
  )
}
```

If you only need to set/dispatch to the store you can just pass an empty string `('')` to the hook and the component will never re render but you can still use the set/dispatch function or any of your passed actions.

```js
import { useStore } from 'location of your store'

const ReactComponent = () => {
  const [, setFoo] = useStore('')

  return <button onClick={() => setFoo('New Foo')}>Set Foo</button>
}
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
