# React Global State Hook

Simple hook for adding a global state to your react app.

### Installation

It's a simple script just copy createStore.js and add it to your project.

## Simple Pattern Usage

Create a simple store anywhere in your app and pass in an initial state.

```js
import createStore from 'location of the pasted script'

export const useStore = createStore('hello')
```

Consume in your react component and use just like reacts useState structure where the first value in the array is the stored state and the second value is the setting function. Setting function can be used just like reacts state setting function eg. `setState('newState')` or with the ability to see the previous state eg. `setState(state => 'something' + state)`.

```js
import { useStore } from 'location of your store'

const ReactComponent = () => {
  const [store, setStore] = useStore()

  const handleClick = () => setStore('I was clicked')

  return <button onClick={handleClick}>{store}</button>
}
```

## Reducer Pattern Usage

Create a store and a reducer.

```js
import createStore from 'location of the pasted script'

const intialState = {
  foo: 'foo',
  bar: 'bar'
}

const reducer = (state = initialState, action) {
  switch(action.type){
    case 'SET_FOO':
      return {
        ...state,
        foo: action.payload
      }
    case 'SET_BAR':
      return {
        ...state,
        bar: action.payload
      }
    default:
      return state
  }
}

export const useStore = createStore(initialState, reducer)
```

Consume in your component and use just like the simple example above but now you can use the second value as a dispatch to your reducer.

```js
import { useStore } from 'location of your store'

const ReactComponent = () => {
  const [store, dispatch] = useStore()

  const handleClick = () => dispatch({ type: 'SET_FOO', payload: 'New Foo' })

  return (
    <button onClick={handleClick}>
      Foo: {store.foo} - Bar: {store.bar}
    </button>
  )
}
```

## Avoid Unwanted Re Renders

The hook can accept a `null` value that will re render your component anytime a value in the store has changed. Pass in `false` if you never want your component to re render. Or pass in an array of keys `['key1', 'key2']` and this will allow the component to re render only if one of these keys in the store object has changed (Only works if you have an object as your store). So if you have a complex store object you can pass an array of keys that you want to use in your components. Say you have the following store object.

```js
import createStore from 'location of the pasted script'

const intialState = {
  foo: 'foo',
  bar: 'bar',
}

export const useStore = createStore(initialState)
```

In your react component you can do the following and your component will only re render if the foo value is changed.

```js
import { useStore } from 'location of your store'

const ReactComponent = () => {
  const [store, setStore] = useStore(['foo'])

  return <p>{store.foo}</p>
}
```

If you only need to dispatch to the store or set the store you can just pass `false` to the hook and the component will never re render but you can still use the set/dispatch function.

```js
import { useStore } from 'location of your store'

const ReactComponent = () => {
  const [, setFoo] = useStore(false)

  return <button onClick={() => setFoo('New Foo')}>Set Foo</button>
}
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
